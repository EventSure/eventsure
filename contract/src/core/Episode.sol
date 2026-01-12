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
    uint256 public immutable premiumAmount;
    uint256 public immutable payoutAmount;

    // ============ Member State ===============
    struct Member {
        bool joined;
        bool payoutClaimed;
        bool surplusClaimed;
    }

    mapping(address => Member) public members;
    
    address[] public memberList;

    modifier onlyFactory() {
        if (msg.sender != FACTORY) revert Errors.Unauthorized();
        _;
    }

    modifier onlyOracle() {
        if (msg.sender != ORACLE) revert Errors.Unauthorized();
        _;
    }

    modifier inState(EpisodeState s) {
        if (state != s) revert Errors.InvalidState();
        _;
    }

    constructor(address _oracle, uint256 _premiumAmount, uint256 _payoutAmount) {
        FACTORY = msg.sender;
        ORACLE = _oracle;
        premiumAmount = _premiumAmount;
        payoutAmount = _payoutAmount;
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

    function resolve(bool _eventOccurred)
        external
        onlyOracle
        inState(EpisodeState.Locked)
    {
        eventOccurred = _eventOccurred;
        state = EpisodeState.Resolved;
        emit EpisodeResolved(_eventOccurred);
    }

    function settle()
        external
        inState(EpisodeState.Resolved)
    {
        if (eventOccurred) {
            // Calculate total payout based on number of members and fixed payoutAmount
            uint256 potentialPayout = payoutAmount * memberList.length;
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
        if (msg.value != premiumAmount) revert Errors.InvalidAmount();
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

        uint256 payout = payoutAmount; // 고정 지급액
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
