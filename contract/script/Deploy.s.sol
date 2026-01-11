// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {Episode} from "../src/core/Episode.sol";

contract DeployScript is Script {
    Episode public episode;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        counter = new Episode();

        vm.stopBroadcast();
    }
}
