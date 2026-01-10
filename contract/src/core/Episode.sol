// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";
import "../interfaces/IEpisode.sol";
import "../libraries/Errors.sol";

/**
 * @title Episode
 * @author Your Name
 * @notice Parametric insurance episode contract with Chainlink Functions integration
 * @dev Manages a single insurance episode with automated oracle-based settlement
 */
contract Episode is IEpisode, FunctionsClient {
    using FunctionsRequest for FunctionsRequest.Request;

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*
     *                              CORE                                 *
     *━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    
    /// @notice Episode start timestamp
    uint256 public immutable startTime;
    
    /// @notice Episode end timestamp
    uint256 public immutable endTime;
    
    /// @notice Premium amount required to join (in wei)
    uint256 public immutable premium;
    
    /// @notice Payout amount per member if loss occurs (in wei)
    uint256 public immutable payoutAmount;
    
    /// @notice Maximum number of participants allowed
    uint256 public immutable maxParticipants;

    /// @notice Current state of the episode
    EpisodeState public override state;

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*
     *                            MEMBER                                 *
     *━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    
    /**
     * @notice Represents a member's participation status
     * @param joined Whether the member has joined the episode
     * @param payoutClaimed Whether the member has claimed their payout
     * @param surplusClaimed Whether the member has claimed their surplus
     */
    struct Member {
        bool joined;
        bool payoutClaimed;
        bool surplusClaimed;
    }

    /// @notice Mapping of member addresses to their participation data
    mapping(address => Member) public members;
    
    /// @notice Array of all member addresses
    address[] public memberList;

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*
     *                          SETTLEMENT                               *
     *━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    
    /// @notice Total premium collected from all members
    uint256 public totalPremium;
    
    /// @notice Total payout amount (set after settlement)
    uint256 public totalPayout;
    
    /// @notice Surplus amount per member if no loss occurred
    uint256 public surplusPerMember;

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*
     *                      CHAINLINK ORACLE                             *
     *━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    
    /// @notice Whether a loss event occurred (determined by oracle)
    bool public lossOccurred;
    
    /// @notice Chainlink Functions subscription ID
    uint64 public subscriptionId;
    
    /// @notice Chainlink Functions DON ID
    bytes32 public donId;
    
    /// @notice Gas limit for Chainlink Functions callback
    uint32 public constant GAS_LIMIT = 300000;
    
    /// @notice Latest Chainlink Functions request ID
    bytes32 public lastRequestId;
    
    /// @notice Address authorized to set oracle configuration
    address public immutable oracleAdmin;
    
    /// @notice JavaScript source code for Chainlink Functions
    /// @dev This should query external APIs to determine if loss occurred
    string public oracleSource;

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*
     *                          MODIFIERS                                *
     *━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    
    /// @notice Restricts function access to oracle admin only
    modifier onlyOracleAdmin() {
        if (msg.sender != oracleAdmin) revert Errors.Unauthorized();
        _;
    }

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*
     *                         CONSTRUCTOR                               *
     *━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    
    /**
     * @notice Creates a new episode
     * @param _start Episode start timestamp
     * @param _end Episode end timestamp
     * @param _premium Premium amount required to join
     * @param _payout Payout amount per member if loss occurs
     * @param _max Maximum number of participants
     * @param _functionsRouter Chainlink Functions router address
     * @param _oracleAdmin Address authorized to configure oracle
     */
    constructor(
        uint256 _start,
        uint256 _end,
        uint256 _premium,
        uint256 _payout,
        uint256 _max,
        address _functionsRouter,
        address _oracleAdmin
    ) FunctionsClient(_functionsRouter) {
        if (_start >= _end) revert Errors.InvalidTimeRange();
        if (_premium == 0) revert Errors.InvalidAmount();
        if (_payout == 0) revert Errors.InvalidAmount();
        if (_max == 0) revert Errors.InvalidAmount();
        if (_functionsRouter == address(0)) revert Errors.ZeroAddress();
        if (_oracleAdmin == address(0)) revert Errors.ZeroAddress();

        startTime = _start;
        endTime = _end;
        premium = _premium;
        payoutAmount = _payout;
        maxParticipants = _max;
        oracleAdmin = _oracleAdmin;

        state = EpisodeState.Created;
    }

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*
     *                      ORACLE CONFIGURATION                         *
     *━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    
    /**
     * @notice Sets Chainlink Functions configuration
     * @dev Can only be called once by oracle admin
     * @param _subscriptionId Chainlink Functions subscription ID
     * @param _donId Chainlink Functions DON ID
     * @param _source JavaScript source code for oracle
     */
    function setOracleConfig(
        uint64 _subscriptionId,
        bytes32 _donId,
        string calldata _source
    ) external onlyOracleAdmin {
        if (subscriptionId != 0) revert Errors.AlreadyConfigured();
        if (_subscriptionId == 0) revert Errors.InvalidAmount();
        if (_donId == bytes32(0)) revert Errors.InvalidParameter();
        if (bytes(_source).length == 0) revert Errors.InvalidParameter();

        subscriptionId = _subscriptionId;
        donId = _donId;
        oracleSource = _source;
    }

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*
     *                             JOIN                                  *
     *━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    
    /**
     * @notice Allows a user to join the episode by paying the premium
     * @dev Can only be called before episode starts and while in Created state
     */
    function join() external payable {
        if (state != EpisodeState.Created) revert Errors.InvalidState();
        if (block.timestamp >= startTime) revert Errors.EpisodeNotActive();
        if (msg.value != premium) revert Errors.InvalidAmount();

        Member storage m = members[msg.sender];
        if (m.joined) revert Errors.AlreadyJoined();
        if (memberList.length >= maxParticipants) revert Errors.MaxParticipantsReached();

        m.joined = true;
        memberList.push(msg.sender);
        totalPremium += msg.value;

        emit MemberJoined(msg.sender, msg.value);

        if (memberList.length == maxParticipants) {
            state = EpisodeState.Active;
            emit EpisodeActivated(memberList.length, totalPremium);
        }
    }

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*
     *                           RESOLVE                                 *
     *━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    
    /**
     * @notice Triggers oracle request to determine if loss occurred
     * @dev Can only be called after episode ends and while in Active state
     * @return requestId The Chainlink Functions request ID
     */
    function resolve() external returns (bytes32) {
        if (state != EpisodeState.Active) revert Errors.InvalidState();
        if (block.timestamp < endTime) revert Errors.EpisodeNotEnded();
        if (subscriptionId == 0) revert Errors.OracleNotConfigured();

        // Build Chainlink Functions request
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(oracleSource);
        
        // Set arguments (e.g., episode parameters)
        string[] memory args = new string[](3);
        args[0] = _uint2str(startTime);
        args[1] = _uint2str(endTime);
        args[2] = _uint2str(block.timestamp);
        req.setArgs(args);
        
        // Send request to Chainlink Functions
        lastRequestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            GAS_LIMIT,
            donId
        );

        emit OracleRequested(lastRequestId, block.timestamp);
        
        return lastRequestId;
    }

    /**
     * @notice Chainlink Functions callback function
     * @dev Automatically called by Chainlink DON with oracle result
     * @param requestId The request ID
     * @param response The response data (encoded bool)
     * @param err Any error that occurred
     */
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        if (requestId != lastRequestId) revert Errors.InvalidRequestId();
        if (err.length > 0) revert Errors.OracleError();
        if (state != EpisodeState.Active) revert Errors.InvalidState();

        // Decode response - expecting a boolean (1 byte: 0x01 for true, 0x00 for false)
        lossOccurred = response.length > 0 && uint8(response[0]) != 0;

        state = EpisodeState.Resolved;

        emit OracleResponseReceived(requestId, lossOccurred);
        emit EpisodeResolved(lossOccurred);
    }

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*
     *                            SETTLE                                 *
     *━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    
    /**
     * @notice Settles the episode based on oracle result
     * @dev Calculates payouts or surplus based on whether loss occurred
     */
    function settle() external {
        if (state != EpisodeState.Resolved) revert Errors.InvalidState();

        if (lossOccurred) {
            // Loss occurred: prepare payouts
            totalPayout = payoutAmount * memberList.length;
            if (address(this).balance < totalPayout) {
                revert Errors.InsufficientBalance();
            }
        } else {
            // No loss: distribute surplus back to members
            surplusPerMember = totalPremium / memberList.length;
        }

        state = EpisodeState.Settled;

        emit EpisodeSettled(totalPayout, surplusPerMember);
    }

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*
     *                             CLAIM                                 *
     *━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    
    /**
     * @notice Allows a member to claim their payout if loss occurred
     * @dev Can only be called after settlement and if loss occurred
     */
    function claimPayout() external {
        if (state != EpisodeState.Settled) revert Errors.SettlementNotCompleted();
        if (!lossOccurred) revert Errors.InvalidState();

        Member storage m = members[msg.sender];
        if (!m.joined) revert Errors.NotMember();
        if (m.payoutClaimed) revert Errors.AlreadyClaimed();

        m.payoutClaimed = true;

        (bool ok, ) = msg.sender.call{value: payoutAmount}("");
        if (!ok) revert Errors.TransferFailed();

        emit PayoutClaimed(msg.sender, payoutAmount);
    }

    /**
     * @notice Allows a member to claim their surplus if no loss occurred
     * @dev Can only be called after settlement and if no loss occurred
     */
    function claimSurplus() external {
        if (state != EpisodeState.Settled) revert Errors.SettlementNotCompleted();
        if (lossOccurred) revert Errors.InvalidState();

        Member storage m = members[msg.sender];
        if (!m.joined) revert Errors.NotMember();
        if (m.surplusClaimed) revert Errors.AlreadyClaimed();

        m.surplusClaimed = true;

        (bool ok, ) = msg.sender.call{value: surplusPerMember}("");
        if (!ok) revert Errors.TransferFailed();

        emit SurplusClaimed(msg.sender, surplusPerMember);
    }

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*
     *                         VIEW FUNCTIONS                            *
     *━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    
    /**
     * @notice Gets the total number of members
     * @return The number of members who have joined
     */
    function getMemberCount() external view returns (uint256) {
        return memberList.length;
    }

    /**
     * @notice Gets member information
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
        ) 
    {
        Member memory m = members[member];
        return (m.joined, m.payoutClaimed, m.surplusClaimed);
    }

    /**
     * @notice Checks if episode is ready to resolve
     * @return True if episode can be resolved
     */
    function canResolve() external view returns (bool) {
        return state == EpisodeState.Active && block.timestamp >= endTime;
    }

    /**
     * @notice Checks if episode is ready to settle
     * @return True if episode can be settled
     */
    function canSettle() external view returns (bool) {
        return state == EpisodeState.Resolved;
    }

    /**
     * @notice Get episode parameters
     * @return _startTime Episode start timestamp
     * @return _endTime Episode end timestamp
     * @return _premium Premium amount
     * @return _payoutAmount Payout amount per member
     * @return _maxParticipants Maximum participants
     */
    function getEpisodeParams() 
        external 
        view 
        returns (
            uint256 _startTime,
            uint256 _endTime,
            uint256 _premium,
            uint256 _payoutAmount,
            uint256 _maxParticipants
        ) 
    {
        return (startTime, endTime, premium, payoutAmount, maxParticipants);
    }

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*
     *                       INTERNAL HELPERS                            *
     *━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    
    /**
     * @notice Converts uint256 to string
     * @param _i The number to convert
     * @return The string representation
     */
    function _uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) return "0";
        
        uint256 j = _i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        j = _i;
        while (j != 0) {
            bstr[--k] = bytes1(uint8(48 + j % 10));
            j /= 10;
        }
        
        return string(bstr);
    }

    /**
     * @notice Allows contract to receive ETH
     */
    receive() external payable {}
}