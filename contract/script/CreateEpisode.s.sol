// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {EpisodeFactory} from "../src/core/EpisodeFactory.sol";
import {console} from "forge-std/console.sol";

contract CreateEpisode is Script {
    // !!! IMPORTANT !!!
    // Replace this with the actual address of your deployed EpisodeFactory contract.
    address constant FACTORY_ADDRESS = 0x4Bf598243d0851067F98Ca231d1574bEEcD33954;

    function run() external {
        // --- Parameters for the new episode ---
        bytes32 productId = "PRODUCT_001";
        uint64 signupStart = uint64(block.timestamp);
        uint64 signupEnd = uint64(block.timestamp + 7 days); // Event sign-up is open for 7 days

        // Get an interface for the deployed factory
        EpisodeFactory factory = EpisodeFactory(FACTORY_ADDRESS);

        console.log("Creating new episode with productId:", string(abi.encodePacked(productId)));
        console.log("Sign-up Start:", signupStart);
        console.log("Sign-up End:", signupEnd);
        console.log("Using Factory at address:", address(factory));

        // Start broadcasting transactions
        vm.startBroadcast();

        // Call the createEpisode function
        address newEpisodeAddress = factory.createEpisode(
            productId,
            signupStart,
            signupEnd
        );

        // Stop broadcasting
        vm.stopBroadcast();

        console.log("-----------------------------------------");
        console.log(unicode"🚀 New Episode Contract Deployed! 🚀");
        console.log("Episode Address:", newEpisodeAddress);
        console.log("-----------------------------------------");
    }
}
