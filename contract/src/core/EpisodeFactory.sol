// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "./Episode.sol";
import "../interfaces/IEpisodeFactory.sol";
import "../libraries/Errors.sol";

/**
 * @title EpisodeFactory
 * @author Your Name
 * @notice Factory contract for creating and managing parametric insurance episodes
 * @dev Manages Chainlink Functions configuration for all episodes
 */
contract EpisodeFactory is IEpisodeFactory, Ownable {
    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*
     *                          STORAGE                                  *
     *━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    
    /// @notice Array of all created episodes
    address[] public episodes;
    
    /// @notice Chainlink Functions subscription ID (shared across episodes)
    uint64 public subscriptionId;
    
    /// @notice Chainlink Functions DON ID
    bytes32 public donId;
    
    /// @notice Chainlink Functions router address
    address public functionsRouter;
    
    /// @notice Whether oracle configuration has been set
    bool public isOracleConfigured;

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*
     *                        CONSTRUCTOR                                *
     *━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    
    /**
     * @notice Initialize the factory
     * @param _owner Address of the factory owner
     */
    constructor(address _owner) Ownable(_owner) {
        if (_owner == address(0)) revert Errors.ZeroAddress();
    }

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*
     *                    ORACLE CONFIGURATION                           *
     *━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    
    /**
     * @notice Set global Chainlink Functions configuration
     * @dev Must be called before creating episodes. Can only be set once.
     * @param _subscriptionId Chainlink Functions subscription ID
     * @param _donId Chainlink Functions DON ID
     * @param _functionsRouter Chainlink Functions router address
     */
    function setOracleConfig(
        uint64 _subscriptionId,
        bytes32 _donId,
        address _functionsRouter
    ) external onlyOwner {
        if (isOracleConfigured) revert Errors.AlreadyConfigured();
        if (_subscriptionId == 0) revert Errors.InvalidAmount();
        if (_donId == bytes32(0)) revert Errors.InvalidParameter();
        if (_functionsRouter == address(0)) revert Errors.ZeroAddress();

        subscriptionId = _subscriptionId;
        donId = _donId;
        functionsRouter = _functionsRouter;
        isOracleConfigured = true;

        emit OracleConfigUpdated(_subscriptionId, _donId, _functionsRouter);
    }

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*
     *                     EPISODE CREATION                              *
     *━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    
    /**
     * @notice Create a new parametric insurance episode
     * @param startTime Episode start timestamp
     * @param endTime Episode end timestamp
     * @param premium Premium amount required to join (in wei)
     * @param payoutAmount Payout amount per member if loss occurs (in wei)
     * @param maxParticipants Maximum number of participants allowed
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
    ) external returns (address episode) {
        if (!isOracleConfigured) revert Errors.OracleNotConfigured();
        if (startTime >= endTime) revert Errors.InvalidTimeRange();
        if (startTime <= block.timestamp) revert Errors.InvalidTimeRange();
        if (premium == 0) revert Errors.InvalidAmount();
        if (payoutAmount == 0) revert Errors.InvalidAmount();
        if (maxParticipants == 0) revert Errors.InvalidAmount();
        if (bytes(oracleSource).length == 0) revert Errors.InvalidParameter();

        // Create new episode with oracle configuration
        Episode ep = new Episode(
            startTime,
            endTime,
            premium,
            payoutAmount,
            maxParticipants,
            functionsRouter,
            address(this) // Factory is the oracle admin
        );

        // Configure oracle for the episode
        ep.setOracleConfig(subscriptionId, donId, oracleSource);

        // Store episode address
        episodes.push(address(ep));

        emit EpisodeCreated(
            address(ep),
            startTime,
            endTime,
            premium,
            payoutAmount,
            maxParticipants
        );

        return address(ep);
    }

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*
     *                       VIEW FUNCTIONS                              *
     *━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    
    /**
     * @notice Get total number of episodes created
     * @return Total number of episodes
     */
    function totalEpisodes() external view returns (uint256) {
        return episodes.length;
    }

    /**
     * @notice Get episode address by index
     * @param index Index of the episode
     * @return Episode address
     */
    function getEpisode(uint256 index) external view returns (address) {
        if (index >= episodes.length) revert Errors.InvalidParameter();
        return episodes[index];
    }

    /**
     * @notice Get all episode addresses
     * @return Array of all episode addresses
     */
    function getAllEpisodes() external view returns (address[] memory) {
        return episodes;
    }

    /**
     * @notice Get oracle configuration
     * @return _subscriptionId Chainlink Functions subscription ID
     * @return _donId Chainlink Functions DON ID
     * @return _functionsRouter Chainlink Functions router address
     */
    function getOracleConfig() 
        external 
        view 
        returns (
            uint64 _subscriptionId,
            bytes32 _donId,
            address _functionsRouter
        ) 
    {
        return (subscriptionId, donId, functionsRouter);
    }
}