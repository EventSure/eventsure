// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {FlightOracle} from "../src/core/FlightOracle.sol";

/**
 * @title UpdateOracle
 * @notice Script to update flight status data in the oracle
 * @dev This script should be called after fetching real flight data from an API
 */
contract UpdateOracleScript is Script {
    function run() external {
        // Load environment variables
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address oracleAddress = vm.envAddress("ORACLE_ADDRESS");
        
        // Flight data (these would come from your API in practice)
        string memory flightNumber = vm.envString("FLIGHT_NUMBER");
        uint64 departureTime = uint64(vm.envUint("DEPARTURE_TIME"));
        uint64 actualArrival = uint64(vm.envUint("ACTUAL_ARRIVAL"));
        bool isDelayed = vm.envBool("IS_DELAYED");
        
        vm.startBroadcast(deployerPrivateKey);
        
        FlightOracle oracle = FlightOracle(oracleAddress);
        
        // Update flight status
        oracle.updateFlightStatus(
            flightNumber,
            departureTime,
            actualArrival,
            isDelayed
        );
        
        console.log("Flight status updated:");
        console.log("  Flight:", flightNumber);
        console.log("  Departure:", departureTime);
        console.log("  Actual Arrival:", actualArrival);
        console.log("  Delayed:", isDelayed);
        
        vm.stopBroadcast();
    }
}

/**
 * @title ResolveEpisode
 * @notice Script to resolve an episode using oracle data
 */
contract ResolveEpisodeScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address oracleAddress = vm.envAddress("ORACLE_ADDRESS");
        address episodeAddress = vm.envAddress("EPISODE_ADDRESS");
        
        vm.startBroadcast(deployerPrivateKey);
        
        FlightOracle oracle = FlightOracle(oracleAddress);
        
        // Resolve the episode
        oracle.resolveEpisode(episodeAddress);
        
        console.log("Episode resolved:");
        console.log("  Oracle:", oracleAddress);
        console.log("  Episode:", episodeAddress);
        
        vm.stopBroadcast();
    }
}
