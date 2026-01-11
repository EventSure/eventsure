// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IEpisode.sol";

abstract contract Episode is IEpisode {
    EpisodeState public override state;

    uint256 public override totalPremium;
    uint256 public override totalPayout;
    uint256 public override surplus;

    mapping(address => uint256) public premiumOf;
    mapping(address => bool) public claimed;
    mapping(address => bool) public surplusWithdrawn;

    bool public eventOccurred;

    address public immutable oracle;
    address public immutable factory;

    // ============ Member State ===============
    struct Member {
        bool joined;
        bool payoutClaimed;
        bool surplusClaimed;
    }

    mapping(address => Member) public members;
    
    address[] public memberList;

    modifier onlyFactory() {
        require(msg.sender == factory, "Not factory");
        _;
    }

    modifier onlyOracle() {
        require(msg.sender == oracle, "Not oracle");
        _;
    }

    modifier inState(EpisodeState s) {
        require(state == s, "Invalid state");
        _;
    }

    constructor(address _oracle) {
        factory = msg.sender;
        oracle = _oracle;
        state = EpisodeState.Created;
        emit EpisodeCreated(oracle, factory);
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
            totalPayout = totalPremium; // 단순 예시
            surplus = 0;
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

    function join(uint256 premium)
        external
        inState(EpisodeState.Open)
    {
        premiumOf[msg.sender] += premium;
        totalPremium += premium;
        emit MemberJoined(msg.sender, premium);
    }

    function claim()
        external
        inState(EpisodeState.Settled)
    {
        require(eventOccurred, "No payout");
        require(!claimed[msg.sender], "Already claimed");

        uint256 payout = premiumOf[msg.sender]; // 단순 비례
        claimed[msg.sender] = true;

        emit PayoutClaimed(msg.sender, payout);

        // ETH 전송 등
    }

    function withdrawSurplus()
        external
        inState(EpisodeState.Settled)
    {
        require(!eventOccurred, "No surplus");
        require(!surplusWithdrawn[msg.sender], "Already withdrawn");

        uint256 amount =
            (premiumOf[msg.sender] * surplus) / totalPremium;

        surplusWithdrawn[msg.sender] = true;

        emit SurplusClaimed(msg.sender, amount);

        // ETH 전송 등
    }
}
