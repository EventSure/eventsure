// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IEpisode} from "../interfaces/IEpisode.sol";
import {Errors} from "../libraries/Errors.sol";

contract Episode is IEpisode {
    EpisodeState public override state;

    uint256 public override totalPremium;
    uint256 public override totalPayout;
    uint256 public override surplus;

    mapping(address => uint256) public premiumOf;
    mapping(address => bool) public claimed;
    mapping(address => bool) public surplusWithdrawn;

    bool public eventOccurred;

    address public immutable FACTORY;
    address public immutable ORACLE;
    uint256 public immutable PREMIUM_AMOUNT;
    uint256 public immutable PAYOUT_AMOUNT;
    string public flightName;
    uint64 public immutable DEPARTURE_TIME;
    uint64 public immutable ESTIMATED_ARRIVAL_TIME;

    uint64 public finalArrivalTime;

    // ============ Member State ===============
    struct Member {
        bool joined;
        bool payoutClaimed;
        bool surplusClaimed;
    }

    mapping(address => Member) public members;
    
    address[] public memberList;

    modifier onlyFactory() {
        _onlyFactory();
        _;
    }

    function _onlyFactory() internal view {
        if (msg.sender != FACTORY) revert Errors.Unauthorized();
    }

    modifier onlyOracle() {
        _onlyOracle();
        _;
    }

    function _onlyOracle() internal view {
        if (msg.sender != ORACLE) revert Errors.Unauthorized();
    }

    modifier inState(EpisodeState s) {
        _inState(s);
        _;
    }

    function _inState(EpisodeState s) internal view {
        if (state != s) revert Errors.InvalidState();
    }

    /* ========== View Functions ========== */

    function premiumAmount() external view override returns (uint256) {
        return PREMIUM_AMOUNT;
    }

    function payoutAmount() external view override returns (uint256) {
        return PAYOUT_AMOUNT;
    }

    function departureTime() external view override returns (uint64) {
        return DEPARTURE_TIME;
    }

    function estimatedArrivalTime() external view override returns (uint64) {
        return ESTIMATED_ARRIVAL_TIME;
    }

    constructor(
        address _oracle,
        uint256 _premiumAmount,
        uint256 _payoutAmount,
        string memory _flightName,
        uint64 _departureTime,
        uint64 _estimatedArrivalTime
    ) {
        FACTORY = msg.sender;
        ORACLE = _oracle;
        PREMIUM_AMOUNT = _premiumAmount;
        PAYOUT_AMOUNT = _payoutAmount;
        flightName = _flightName;
        DEPARTURE_TIME = _departureTime;
        ESTIMATED_ARRIVAL_TIME = _estimatedArrivalTime;
        state = EpisodeState.Created;
        emit EpisodeCreated(ORACLE, FACTORY);
    }

    /* ========== State Transitions ========== */

    function open() external onlyFactory inState(EpisodeState.Created) {
        state = EpisodeState.Open;
        emit EpisodeOpened();
    }

    function lock() external onlyFactory inState(EpisodeState.Open) {
        state = EpisodeState.Locked;
        emit EpisodeLocked();
    }

    function resolve(bool _eventOccurred, uint64 _finalArrivalTime)
        external
        onlyOracle
        inState(EpisodeState.Locked)
    {
        eventOccurred = _eventOccurred;
        finalArrivalTime = _finalArrivalTime;
        state = EpisodeState.Resolved;
        emit EpisodeResolved(_eventOccurred, _finalArrivalTime);
    }

    function settle()
        external
        inState(EpisodeState.Resolved)
    {
        if (eventOccurred) {
            // Calculate total payout based on number of members and fixed PAYOUT_AMOUNT
            uint256 potentialPayout = PAYOUT_AMOUNT * memberList.length;
            totalPayout = (potentialPayout > totalPremium) ? totalPremium : potentialPayout;
            surplus = totalPremium - totalPayout;
        } else {
            totalPayout = 0;
            surplus = totalPremium;
        }
        state = EpisodeState.Settled;
        emit EpisodeSettled(totalPayout, surplus);
    }

    function close()
        external
        onlyFactory
        inState(EpisodeState.Settled)
    {
        state = EpisodeState.Closed;
        emit EpisodeClosed();
    }

    /* ========== User Actions ========== */

    function join()
        external
        payable
        inState(EpisodeState.Open)
    {
        if (msg.value != PREMIUM_AMOUNT) revert Errors.InvalidAmount();
        if (members[msg.sender].joined) revert Errors.AlreadyJoined();

        members[msg.sender].joined = true;
        memberList.push(msg.sender);

        premiumOf[msg.sender] += msg.value;
        totalPremium += msg.value;
        emit MemberJoined(msg.sender, msg.value);
    }

    function claim()
        external
        inState(EpisodeState.Settled)
    {
        if (!eventOccurred) revert Errors.NoPayoutAvailable(); // Check if event occurred
        if (claimed[msg.sender]) revert Errors.AlreadyClaimed(); // Check if already claimed

        uint256 payout = PAYOUT_AMOUNT; // 고정 지급액
        claimed[msg.sender] = true;

        emit PayoutClaimed(msg.sender, payout);

        // Perform ETH transfer
        // Using `call` for robust transfer, checking success and handling re-entrancy risks.
        (bool success, ) = payable(msg.sender).call{value: payout}("");
        if (!success) revert Errors.TransferFailed();
    }

    function withdrawSurplus()
        external
        inState(EpisodeState.Settled)
    {
        if (eventOccurred) revert Errors.NoSurplusAvailable(); // Check if event occurred (no surplus if event occurred)
        if (surplusWithdrawn[msg.sender]) revert Errors.SurplusAlreadyWithdrawn(); // Check if already withdrawn

        // Calculate the individual surplus share
        uint256 amount = (premiumOf[msg.sender] * surplus) / totalPremium;

        // Ensure there's actual surplus to withdraw for this member
        if (amount == 0) revert Errors.NoSurplusAvailable(); // Or a more specific error like "NoIndividualSurplus"

        surplusWithdrawn[msg.sender] = true;

        emit SurplusClaimed(msg.sender, amount);

        // Perform ETH transfer
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        if (!success) revert Errors.TransferFailed();
    }
}
