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

    /* ========== View ========== */

    function state() external view returns (EpisodeState);
    function totalPremium() external view returns (uint256);
    function totalPayout() external view returns (uint256);
    function surplus() external view returns (uint256);

    /* ========== User Actions ========== */

    function join(uint256 premium) external;

    function claim() external;
    function withdrawSurplus() external;

    /* ========== State Transitions ========== */

    function open() external;
    function lock() external;
    function resolve(bool eventOccurred) external;
    function settle() external;
    function close() external;
}
