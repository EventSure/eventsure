// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Test, console2} from "forge-std/Test.sol";
import {FlightOracle} from "../src/core/FlightOracle.sol";
import {Episode} from "../src/core/Episode.sol";
import {Errors} from "../src/libraries/Errors.sol";

contract FlightOracleTest is Test {
    FlightOracle public oracle;
    Episode public episode;
    
    address public owner;
    address public user1;
    address public user2;
    
    uint256 constant PREMIUM_AMOUNT = 1 ether;
    uint256 constant PAYOUT_AMOUNT = 2 ether;
    string constant FLIGHT_NUMBER = "KE123";
    uint64 constant DEPARTURE_TIME = 1705000000; // Jan 11, 2024
    uint64 constant ESTIMATED_ARRIVAL = 1705010000; // ~3 hours later
    uint64 constant ACTUAL_ARRIVAL = 1705017200; // ~5 hours later (delayed)
    
    function setUp() public {
        owner = makeAddr("owner");
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        
        vm.startPrank(owner);
        oracle = new FlightOracle();
        episode = new Episode(
            address(oracle),
            PREMIUM_AMOUNT,
            PAYOUT_AMOUNT,
            FLIGHT_NUMBER,
            DEPARTURE_TIME,
            ESTIMATED_ARRIVAL
        );
        vm.stopPrank();
    }
    
    /* ========== updateFlightStatus Tests ========== */
    
    function test_UpdateFlightStatus_CorrectlyUpdatesWithValidData() public {
        vm.startPrank(owner);
        
        // Update flight status
        oracle.updateFlightStatus(FLIGHT_NUMBER, DEPARTURE_TIME, ACTUAL_ARRIVAL, true);
        
        // Get flight status
        FlightOracle.FlightStatus memory status = oracle.getFlightStatus(FLIGHT_NUMBER, DEPARTURE_TIME);
        
        // Assertions
        assertEq(status.flightNumber, FLIGHT_NUMBER, "Flight number should match");
        assertEq(status.actualArrival, ACTUAL_ARRIVAL, "Actual arrival should match");
        assertTrue(status.isDelayed, "Flight should be marked as delayed");
        assertTrue(status.dataAvailable, "Data should be available");
        assertEq(status.updatedAt, block.timestamp, "Updated timestamp should match block timestamp");
        
        vm.stopPrank();
    }
    
    function test_UpdateFlightStatus_EmitsEvent() public {
        bytes32 expectedFlightId = oracle.getFlightId(FLIGHT_NUMBER, DEPARTURE_TIME);
        
        vm.startPrank(owner);
        vm.expectEmit(true, false, false, true);
        emit FlightOracle.FlightStatusUpdated(expectedFlightId, FLIGHT_NUMBER, ACTUAL_ARRIVAL, true);
        
        oracle.updateFlightStatus(FLIGHT_NUMBER, DEPARTURE_TIME, ACTUAL_ARRIVAL, true);
        vm.stopPrank();
    }
    
    function test_UpdateFlightStatus_RevertsWhenNotOwner() public {
        vm.startPrank(user1);
        vm.expectRevert(Errors.Unauthorized.selector);
        oracle.updateFlightStatus(FLIGHT_NUMBER, DEPARTURE_TIME, ACTUAL_ARRIVAL, true);
        vm.stopPrank();
    }
    
    function test_UpdateFlightStatus_HandlesMultipleFlights() public {
        vm.startPrank(owner);
        
        // Update first flight
        oracle.updateFlightStatus("KE123", 1705000000, 1705010000, false);
        
        // Update second flight
        oracle.updateFlightStatus("KE456", 1705020000, 1705030000, true);
        
        // Verify both flights have independent data
        FlightOracle.FlightStatus memory status1 = oracle.getFlightStatus("KE123", 1705000000);
        FlightOracle.FlightStatus memory status2 = oracle.getFlightStatus("KE456", 1705020000);
        
        assertEq(status1.flightNumber, "KE123");
        assertFalse(status1.isDelayed);
        assertEq(status2.flightNumber, "KE456");
        assertTrue(status2.isDelayed);
        
        vm.stopPrank();
    }
    
    /* ========== resolveEpisode Tests ========== */
    
    function test_ResolveEpisode_CorrectlyResolvesWithDelayCondition() public {
        vm.startPrank(owner);
        
        // Setup: Update flight status with significant delay (> 2 hours)
        uint64 delayedArrival = ESTIMATED_ARRIVAL + 2 hours + 1;
        oracle.updateFlightStatus(FLIGHT_NUMBER, DEPARTURE_TIME, delayedArrival, true);
        
        // Open and lock episode
        episode.open();
        episode.lock();
        
        // Resolve episode
        oracle.resolveEpisode(address(episode));
        
        // Verify episode is resolved with eventOccurred = true
        assertTrue(episode.eventOccurred(), "Event should have occurred due to delay");
        assertEq(episode.finalArrivalTime(), delayedArrival, "Final arrival time should match");
        
        vm.stopPrank();
    }
    
    function test_ResolveEpisode_NoEventWhenDelayUnderThreshold() public {
        vm.startPrank(owner);
        
        // Setup: Update flight status with minor delay (< 2 hours)
        uint64 minorDelayArrival = ESTIMATED_ARRIVAL + 1 hours;
        oracle.updateFlightStatus(FLIGHT_NUMBER, DEPARTURE_TIME, minorDelayArrival, false);
        
        // Open and lock episode
        episode.open();
        episode.lock();
        
        // Resolve episode
        oracle.resolveEpisode(address(episode));
        
        // Verify episode is resolved with eventOccurred = false
        assertFalse(episode.eventOccurred(), "Event should not have occurred - delay under threshold");
        assertEq(episode.finalArrivalTime(), minorDelayArrival, "Final arrival time should match");
        
        vm.stopPrank();
    }
    
    function test_ResolveEpisode_ExactlyTwoHoursDelay() public {
        vm.startPrank(owner);
        
        // Setup: Update flight status with exactly 2 hours delay
        uint64 exactTwoHourDelay = ESTIMATED_ARRIVAL + 2 hours;
        oracle.updateFlightStatus(FLIGHT_NUMBER, DEPARTURE_TIME, exactTwoHourDelay, false);
        
        // Open and lock episode
        episode.open();
        episode.lock();
        
        // Resolve episode
        oracle.resolveEpisode(address(episode));
        
        // Verify episode is resolved with eventOccurred = false (needs > 2 hours)
        assertFalse(episode.eventOccurred(), "Event should not occur at exactly 2 hours");
        
        vm.stopPrank();
    }
    
    function test_ResolveEpisode_RevertsWhenDataNotAvailable() public {
        vm.startPrank(owner);
        
        // Don't update flight status
        episode.open();
        episode.lock();
        
        // Try to resolve without flight data
        vm.expectRevert(Errors.InvalidParameter.selector);
        oracle.resolveEpisode(address(episode));
        
        vm.stopPrank();
    }
    
    function test_ResolveEpisode_RevertsWhenNotOwner() public {
        vm.prank(owner);
        oracle.updateFlightStatus(FLIGHT_NUMBER, DEPARTURE_TIME, ACTUAL_ARRIVAL, true);
        
        vm.startPrank(user1);
        vm.expectRevert(Errors.Unauthorized.selector);
        oracle.resolveEpisode(address(episode));
        vm.stopPrank();
    }
    
    function test_ResolveEpisode_EmitsEvent() public {
        vm.startPrank(owner);
        
        uint64 delayedArrival = ESTIMATED_ARRIVAL + 3 hours;
        oracle.updateFlightStatus(FLIGHT_NUMBER, DEPARTURE_TIME, delayedArrival, true);
        
        episode.open();
        episode.lock();
        
        vm.expectEmit(true, false, false, true);
        emit FlightOracle.EpisodeResolvedByOracle(address(episode), true, delayedArrival);
        
        oracle.resolveEpisode(address(episode));
        vm.stopPrank();
    }
    
    /* ========== getFlightId Tests ========== */
    
    function test_GetFlightId_GeneratesConsistentHash() public {
        bytes32 flightId1 = oracle.getFlightId(FLIGHT_NUMBER, DEPARTURE_TIME);
        bytes32 flightId2 = oracle.getFlightId(FLIGHT_NUMBER, DEPARTURE_TIME);
        
        assertEq(flightId1, flightId2, "Flight ID should be consistent for same inputs");
    }
    
    function test_GetFlightId_DifferentForDifferentFlights() public {
        bytes32 flightId1 = oracle.getFlightId("KE123", DEPARTURE_TIME);
        bytes32 flightId2 = oracle.getFlightId("KE456", DEPARTURE_TIME);
        
        assertTrue(flightId1 != flightId2, "Different flight numbers should produce different IDs");
    }
    
    function test_GetFlightId_DifferentForDifferentTimes() public {
        bytes32 flightId1 = oracle.getFlightId(FLIGHT_NUMBER, DEPARTURE_TIME);
        bytes32 flightId2 = oracle.getFlightId(FLIGHT_NUMBER, DEPARTURE_TIME + 1);
        
        assertTrue(flightId1 != flightId2, "Different departure times should produce different IDs");
    }
    
    function test_GetFlightId_HandlesEmptyFlightNumber() public {
        bytes32 flightId = oracle.getFlightId("", DEPARTURE_TIME);
        assertTrue(flightId != bytes32(0), "Should generate hash even for empty string");
    }
    
    function test_GetFlightId_HandlesLongFlightNumber() public {
        string memory longFlightNumber = "VERYLONGFLIGHTNUMBERWITHLOTOFCHARACTERS123456789";
        bytes32 flightId = oracle.getFlightId(longFlightNumber, DEPARTURE_TIME);
        assertTrue(flightId != bytes32(0), "Should generate hash for long flight numbers");
    }
    
    /* ========== transferOwnership Tests ========== */
    
    function test_TransferOwnership_UpdatesOwner() public {
        vm.startPrank(owner);
        
        address newOwner = makeAddr("newOwner");
        oracle.transferOwnership(newOwner);
        
        assertEq(oracle.owner(), newOwner, "Owner should be updated");
        
        vm.stopPrank();
    }
    
    function test_TransferOwnership_RestrictsAccessToOnlyCurrentOwner() public {
        // Non-owner tries to transfer ownership
        vm.startPrank(user1);
        vm.expectRevert(Errors.Unauthorized.selector);
        oracle.transferOwnership(user2);
        vm.stopPrank();
        
        // Original owner can still transfer
        vm.prank(owner);
        oracle.transferOwnership(user1);
        assertEq(oracle.owner(), user1, "Owner should be updated by original owner");
        
        // Old owner can no longer transfer
        vm.startPrank(owner);
        vm.expectRevert(Errors.Unauthorized.selector);
        oracle.transferOwnership(user2);
        vm.stopPrank();
        
        // New owner can transfer
        vm.prank(user1);
        oracle.transferOwnership(user2);
        assertEq(oracle.owner(), user2, "Owner should be updated by new owner");
    }
    
    function test_TransferOwnership_RevertsOnZeroAddress() public {
        vm.startPrank(owner);
        vm.expectRevert(Errors.InvalidParameter.selector);
        oracle.transferOwnership(address(0));
        vm.stopPrank();
    }
    
    function test_TransferOwnership_NewOwnerCanUpdateFlightStatus() public {
        address newOwner = makeAddr("newOwner");
        
        vm.prank(owner);
        oracle.transferOwnership(newOwner);
        
        // Old owner cannot update
        vm.startPrank(owner);
        vm.expectRevert(Errors.Unauthorized.selector);
        oracle.updateFlightStatus(FLIGHT_NUMBER, DEPARTURE_TIME, ACTUAL_ARRIVAL, true);
        vm.stopPrank();
        
        // New owner can update
        vm.startPrank(newOwner);
        oracle.updateFlightStatus(FLIGHT_NUMBER, DEPARTURE_TIME, ACTUAL_ARRIVAL, true);
        
        FlightOracle.FlightStatus memory status = oracle.getFlightStatus(FLIGHT_NUMBER, DEPARTURE_TIME);
        assertTrue(status.dataAvailable, "New owner should be able to update flight status");
        vm.stopPrank();
    }
}
