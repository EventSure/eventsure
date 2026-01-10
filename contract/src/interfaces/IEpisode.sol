// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IEpisode
 * @notice Interface for parametric insurance episode contracts
 */
interface IEpisode {
    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*
     *                            ENUMS                                  *
     *━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    
    /**
     * @notice Episode lifecycle states
     * @param Created Initial state, users can join
     * @param Active Episode has started, waiting for end time
     * @param Resolved Oracle has determined loss occurrence
     * @param Settled Payouts/surplus calculated, ready for claims
     */
    enum EpisodeState {
        Created,
        Active,
        Resolved,
        Settled
    }

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*
     *                           EVENTS                                  *
     *━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    
    event MemberJoined(address indexed member, uint256 premium);
    event EpisodeActivated(uint256 totalMembers, uint256 totalPremium);
    event OracleRequested(bytes32 indexed requestId, uint256 timestamp);
    event OracleResponseReceived(bytes32 indexed requestId, bool lossOccurred);
    event EpisodeResolved(bool lossOccurred);
    event EpisodeSettled(uint256 totalPayout, uint256 surplusPerMember);
    event PayoutClaimed(address indexed member, uint256 amount);
    event SurplusClaimed(address indexed member, uint256 amount);

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*
     *                      CORE FUNCTIONS                               *
     *━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    
    /**
     * @notice Join the episode by paying premium
     */
    function join() external payable;
    
    /**
     * @notice Trigger oracle request to determine loss occurrence
     * @return requestId The Chainlink Functions request ID
     */
    function resolve() external returns (bytes32 requestId);
    
    /**
     * @notice Calculate and finalize payouts or surplus
     */
    function settle() external;
    
    /**
     * @notice Claim payout if loss occurred
     */
    function claimPayout() external;
    
    /**
     * @notice Claim surplus if no loss occurred
     */
    function claimSurplus() external;

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*
     *                       VIEW FUNCTIONS                              *
     *━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    
    /**
     * @notice Get current episode state
     */
    function state() external view returns (EpisodeState);
    
    /**
     * @notice Get total number of members
     */
    function getMemberCount() external view returns (uint256);
    
    /**
     * @notice Get member information
     * @param member The member address
     * @return joined Whether the member has joined
     * @return payoutClaimed Whether payout has been claimed
     * @return surplusClaimed Whether surplus has been claimed
     */
    function getMemberInfo(address member) 
        external 
        view 
        returns (
            bool joined,
            bool payoutClaimed,
            bool surplusClaimed
        );
    
    /**
     * @notice Check if episode can be resolved
     */
    function canResolve() external view returns (bool);
    
    /**
     * @notice Check if episode can be settled
     */
    function canSettle() external view returns (bool);
    
    /**
     * @notice Get whether loss occurred
     */
    function lossOccurred() external view returns (bool);
    
    /**
     * @notice Get episode parameters
     */
    function getEpisodeParams() 
        external 
        view 
        returns (
            uint256 startTime,
            uint256 endTime,
            uint256 premium,
            uint256 payoutAmount,
            uint256 maxParticipants
        );
}