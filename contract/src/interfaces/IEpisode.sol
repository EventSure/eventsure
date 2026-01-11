// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IEpisode {
    enum EpisodeState {
        Created,
        Open,
        Locked,
        Resolved,
        Settled,
        Closed
    }

    /* ========== Events ========== */

    // Pool
    event EpisodeCreated(address indexed oracle, address indexed factory);
    event EpisodeOpened();
    event EpisodeLocked();
    event EpisodeResolved(bool eventOccurred);
    event EpisodeSettled(uint256 totalPayout, uint256 surplus);
    event EpisodeClosed();
    
    // Member
    event MemberJoined(address indexed member, uint256 premium);
    event PayoutClaimed(address indexed member, uint256 amount);
    event SurplusClaimed(address indexed member, uint256 amount);
    

    /* ========== View ========== */

    function state() external view returns (EpisodeState);
    function totalPremium() external view returns (uint256);
    function totalPayout() external view returns (uint256);
    function surplus() external view returns (uint256);

    /* ========== User Actions ========== */

    function join() external payable;

    function claim() external;
    function withdrawSurplus() external;

    /* ========== State Transitions ========== */

    function open() external;
    function lock() external;
    function resolve(bool eventOccurred) external;
    function settle() external;
    function close() external;
}
