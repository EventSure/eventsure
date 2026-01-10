// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IEpisodeFactory
 * @notice Interface for creating and managing episode contracts
 */
interface IEpisodeFactory {
    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*
     *                           EVENTS                                  *
     *━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    
    event EpisodeCreated(
        address indexed episode,
        uint256 startTime,
        uint256 endTime,
        uint256 premium,
        uint256 payoutAmount,
        uint256 maxParticipants
    );
    
    event OracleConfigUpdated(
        uint64 subscriptionId,
        bytes32 donId,
        address functionsRouter
    );

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*
     *                      CORE FUNCTIONS                               *
     *━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    
    /**
     * @notice Create a new episode with oracle configuration
     * @param startTime Episode start timestamp
     * @param endTime Episode end timestamp
     * @param premium Premium amount required to join
     * @param payoutAmount Payout amount per member if loss occurs
     * @param maxParticipants Maximum number of participants
     * @param oracleSource JavaScript source code for Chainlink Functions
     * @return episode Address of the created episode
     */
    function createEpisode(
        uint256 startTime,
        uint256 endTime,
        uint256 premium,
        uint256 payoutAmount,
        uint256 maxParticipants,
        string calldata oracleSource
    ) external returns (address episode);
    
    /**
     * @notice Set global oracle configuration
     * @param subscriptionId Chainlink Functions subscription ID
     * @param donId Chainlink Functions DON ID
     * @param functionsRouter Chainlink Functions router address
     */
    function setOracleConfig(
        uint64 subscriptionId,
        bytes32 donId,
        address functionsRouter
    ) external;

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*
     *                       VIEW FUNCTIONS                              *
     *━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    
    /**
     * @notice Get total number of episodes created
     */
    function totalEpisodes() external view returns (uint256);
    
    /**
     * @notice Get episode address by index
     */
    function getEpisode(uint256 index) external view returns (address);
    
    /**
     * @notice Get oracle configuration
     */
    function getOracleConfig() 
        external 
        view 
        returns (
            uint64 subscriptionId,
            bytes32 donId,
            address functionsRouter
        );
}