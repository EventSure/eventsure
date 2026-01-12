// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Episode} from "./Episode.sol";
import {Errors} from "../libraries/Errors.sol";

/**
 * @title FlightOracle
 * @notice Simple oracle contract for flight delay insurance
 * @dev Owner can update flight status data and resolve episodes
 */
contract FlightOracle {
    address public owner;
    
    // Flight status data
    struct FlightStatus {
        string flightNumber;
        uint64 scheduledArrival;
        uint64 actualArrival;
        bool isDelayed;
        bool dataAvailable;
        uint64 updatedAt;
    }
    
    // flightNumber + departureTime => FlightStatus
    mapping(bytes32 => FlightStatus) public flightStatuses;
    
    event FlightStatusUpdated(
        bytes32 indexed flightId,
        string flightNumber,
        uint64 actualArrival,
        bool isDelayed
    );
    
    event EpisodeResolvedByOracle(
        address indexed episode,
        bool eventOccurred,
        uint64 finalArrivalTime
    );
    
    modifier onlyOwner() {
        _onlyOwner();
        _;
    }

    function _onlyOwner() internal view {
        if (msg.sender != owner) revert Errors.Unauthorized();
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @notice Update flight status data
     * @param flightNumber Flight number (e.g., "KE123")
     * @param departureTime Scheduled departure timestamp
     * @param actualArrival Actual arrival timestamp
     * @param isDelayed Whether the flight was delayed
     */
    function updateFlightStatus(
        string memory flightNumber,
        uint64 departureTime,
        uint64 actualArrival,
        bool isDelayed
    ) external onlyOwner {
        bytes32 flightId = getFlightId(flightNumber, departureTime);
        
        flightStatuses[flightId] = FlightStatus({
            flightNumber: flightNumber,
            scheduledArrival: 0, // Can be set if needed
            actualArrival: actualArrival,
            isDelayed: isDelayed,
            dataAvailable: true,
            updatedAt: uint64(block.timestamp)
        });
        
        emit FlightStatusUpdated(flightId, flightNumber, actualArrival, isDelayed);
    }
    
    /**
     * @notice Resolve an episode with flight data
     * @param episodeAddress Address of the episode contract
     */
    function resolveEpisode(address episodeAddress) external onlyOwner {
        Episode episode = Episode(episodeAddress);
        
        // Get flight info from episode
        string memory flightNumber = episode.flightName();
        uint64 departureTime = episode.departureTime();
        uint64 estimatedArrival = episode.estimatedArrivalTime();
        
        // Get flight status
        bytes32 flightId = getFlightId(flightNumber, departureTime);
        FlightStatus memory status = flightStatuses[flightId];
        
        if (!status.dataAvailable) revert Errors.InvalidParameter();
        
        // Determine if event occurred (delayed by more than 2 hours)
        uint64 delayThreshold = 2 hours;
        bool eventOccurred = status.actualArrival > estimatedArrival + delayThreshold;
        
        // Resolve the episode
        episode.resolve(eventOccurred, status.actualArrival);
        
        emit EpisodeResolvedByOracle(episodeAddress, eventOccurred, status.actualArrival);
    }
    
    /**
     * @notice Get flight ID hash
     * @param flightNumber Flight number
     * @param departureTime Departure timestamp
     * @return Flight ID hash
     */
    function getFlightId(string memory flightNumber, uint64 departureTime) 
        public 
        pure 
        returns (bytes32) 
    {
        bytes32 result;
        assembly {
            let ptr := mload(0x40)
            let flightNumberLen := mload(flightNumber)
            let flightNumberData := add(flightNumber, 0x20)
            
            // Copy flightNumber to memory
            for { let i := 0 } lt(i, flightNumberLen) { i := add(i, 0x20) } {
                mstore(add(ptr, i), mload(add(flightNumberData, i)))
            }
            
            // Append departureTime (8 bytes for uint64)
            mstore(add(ptr, flightNumberLen), shl(192, departureTime))
            
            // Calculate keccak256
            result := keccak256(ptr, add(flightNumberLen, 8))
        }
        return result;
    }
    
    /**
     * @notice Get flight status
     * @param flightNumber Flight number
     * @param departureTime Departure timestamp
     * @return Flight status data
     */
    function getFlightStatus(string memory flightNumber, uint64 departureTime)
        external
        view
        returns (FlightStatus memory)
    {
        bytes32 flightId = getFlightId(flightNumber, departureTime);
        return flightStatuses[flightId];
    }
    
    /**
     * @notice Transfer ownership
     * @param newOwner New owner address
     */
    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert Errors.InvalidParameter();
        owner = newOwner;
    }
}
