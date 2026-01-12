// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Errors
 * @notice Library containing all custom errors for the insurance protocol
 */
library Errors {
    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*
     *                        GENERAL ERRORS                             *
     *━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    
    /// @notice Thrown when an operation is performed in an invalid state
    error InvalidState();
    
    /// @notice Thrown when an invalid amount is provided
    error InvalidAmount();
    
    /// @notice Thrown when a zero address is provided
    error ZeroAddress();
    
    /// @notice Thrown when an invalid parameter is provided
    error InvalidParameter();
    
    /// @notice Thrown when an invalid time range is provided
    error InvalidTimeRange();
    
    /// @notice Thrown when a transfer fails
    error TransferFailed();
    
    /// @notice Thrown when caller is not authorized
    error Unauthorized();
    
    /// @notice Thrown when contract has insufficient balance
    error InsufficientBalance();
    
    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*
     *                       EPISODE ERRORS                              *
     *━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    
    /// @notice Thrown when trying to join an inactive episode
    error EpisodeNotActive();
    
    /// @notice Thrown when trying to resolve before episode ends
    error EpisodeNotEnded();
    
    /// @notice Thrown when user has already joined
    error AlreadyJoined();
    
    /// @notice Thrown when maximum participants limit is reached
    error MaxParticipantsReached();
    
        /// @notice Thrown when user is not a member
        error NotMember();
    
        /// @notice Thrown when claim has already been made
        error AlreadyClaimed();
    
        /// @notice Thrown when settlement is not completed
        error SettlementNotCompleted();
        
        /// @notice Thrown when no payout is available
        error NoPayoutAvailable();
    
        /// @notice Thrown when no surplus is available
        error NoSurplusAvailable();
        
        /// @notice Thrown when surplus has already been withdrawn
        error SurplusAlreadyWithdrawn();    
    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*
     *                       ORACLE ERRORS                               *
     *━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    
    /// @notice Thrown when oracle is not configured
    error OracleNotConfigured();
    
    /// @notice Thrown when oracle configuration already exists
    error AlreadyConfigured();
    
    /// @notice Thrown when oracle request ID is invalid
    error InvalidRequestId();
    
    /// @notice Thrown when oracle returns an error
    error OracleError();
}