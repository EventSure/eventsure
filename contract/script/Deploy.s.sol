// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {EpisodeFactory} from "../src/core/EpisodeFactory.sol";
import {FlightOracle} from "../src/core/FlightOracle.sol";

contract Deploy is Script {
    FlightOracle public oracle;
    EpisodeFactory public factory;

    function run() public {
        vm.startBroadcast();

        // Deploy FlightOracle first
        oracle = new FlightOracle();
        console.log("FlightOracle deployed at:", address(oracle));

        // Deploy EpisodeFactory with oracle address
        factory = new EpisodeFactory(address(oracle));
        console.log("EpisodeFactory deployed at:", address(factory));

        vm.stopBroadcast();
    }
}
