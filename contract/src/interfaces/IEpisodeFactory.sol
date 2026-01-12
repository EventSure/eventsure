// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IEpisodeFactory {
    function createEpisode(
        bytes32 productId,
        uint64 signupStart,
        uint64 signupEnd,
        uint256 premiumAmount,
        uint256 payoutAmount,
        string memory flightName,
        uint64 departureTime,
        uint64 estimatedArrivalTime
    ) external returns (address);

    function openEpisode(address episode) external;
    function lockEpisode(address episode) external;
    function closeEpisode(address episode) external;

    function allEpisodes() external view returns (address[] memory);
}
