// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {EpisodeFactory} from "../src/core/EpisodeFactory.sol";

contract Deploy is Script {
    EpisodeFactory public factory;

    // A placeholder for the oracle address.
    // Replace this with the actual oracle address for the target network.
    address constant ORACLE_ADDRESS = 0x5FbDB2315678afecb367f032d93F642f64180aa3;

    function run() public {
        vm.startBroadcast();

        factory = new EpisodeFactory(ORACLE_ADDRESS);

        vm.stopBroadcast();
    }
}
