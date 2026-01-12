// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Test, console2} from "forge-std/Test.sol";
import {Episode} from "../src/core/Episode.sol";
import {IEpisode} from "../src/interfaces/IEpisode.sol";
import {Errors} from "../src/libraries/Errors.sol";

// Helper contract that can receive ETH
contract EthReceiver {
    receive() external payable {}
}

contract EpisodeTest is Test {
    Episode public episode;
    
    address public factory;
    address public oracle;
    address public user1;
    address public user2;
    address public user3;
    
    uint256 constant PREMIUM_AMOUNT = 1 ether;
    uint256 constant PAYOUT_AMOUNT = 2 ether;
    string constant FLIGHT_NAME = "KE123";
    uint64 constant DEPARTURE_TIME = 1705000000;
    uint64 constant ESTIMATED_ARRIVAL = 1705010000;
    
    event EpisodeCreated(address indexed oracle, address indexed factory);
    event EpisodeOpened();
    event EpisodeLocked();
    event EpisodeResolved(bool eventOccurred, uint64 finalArrivalTime);
    event EpisodeSettled(uint256 totalPayout, uint256 surplus);
    event MemberJoined(address indexed member, uint256 premium);
    event PayoutClaimed(address indexed member, uint256 amount);
    event SurplusClaimed(address indexed member, uint256 amount);
    
    function setUp() public {
        factory = makeAddr("factory");
        oracle = makeAddr("oracle");
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        user3 = makeAddr("user3");
        
        vm.deal(user1, 10 ether);
        vm.deal(user2, 10 ether);
        vm.deal(user3, 10 ether);
        
        vm.prank(factory);
        episode = new Episode(
            oracle,
            PREMIUM_AMOUNT,
            PAYOUT_AMOUNT,
            FLIGHT_NAME,
            DEPARTURE_TIME,
            ESTIMATED_ARRIVAL
        );
    }
    
    /* ========== Constructor & Premium/Payout Amount Tests ========== */
    
    function test_Constructor_SetsPremiumAmountCorrectly() public {
        assertEq(episode.premiumAmount(), PREMIUM_AMOUNT, "Premium amount should match constructor parameter");
        assertEq(episode.PREMIUM_AMOUNT(), PREMIUM_AMOUNT, "PREMIUM_AMOUNT immutable should match");
    }
    
    function test_Constructor_SetsPayoutAmountCorrectly() public {
        assertEq(episode.payoutAmount(), PAYOUT_AMOUNT, "Payout amount should match constructor parameter");
        assertEq(episode.PAYOUT_AMOUNT(), PAYOUT_AMOUNT, "PAYOUT_AMOUNT immutable should match");
    }
    
    function test_Constructor_EnforcesPremiumAndPayoutValues() public {
        // Create episode with different values
        vm.prank(factory);
        Episode customEpisode = new Episode(
            oracle,
            0.5 ether,
            3 ether,
            FLIGHT_NAME,
            DEPARTURE_TIME,
            ESTIMATED_ARRIVAL
        );
        
        assertEq(customEpisode.premiumAmount(), 0.5 ether, "Custom premium amount should be enforced");
        assertEq(customEpisode.payoutAmount(), 3 ether, "Custom payout amount should be enforced");
    }
    
    function test_Constructor_InitializesInCreatedState() public {
        assertEq(uint(episode.state()), uint(IEpisode.EpisodeState.Created), "Initial state should be Created");
    }
    
    /* ========== State Transition Tests ========== */
    
    function test_StateTransition_CreatedToOpen() public {
        vm.prank(factory);
        episode.open();
        
        assertEq(uint(episode.state()), uint(IEpisode.EpisodeState.Open), "State should be Open");
    }
    
    function test_StateTransition_OpenToLocked() public {
        vm.startPrank(factory);
        episode.open();
        episode.lock();
        vm.stopPrank();
        
        assertEq(uint(episode.state()), uint(IEpisode.EpisodeState.Locked), "State should be Locked");
    }
    
    function test_StateTransition_LockedToResolved() public {
        vm.startPrank(factory);
        episode.open();
        episode.lock();
        vm.stopPrank();
        
        vm.prank(oracle);
        episode.resolve(true, ESTIMATED_ARRIVAL + 3 hours);
        
        assertEq(uint(episode.state()), uint(IEpisode.EpisodeState.Resolved), "State should be Resolved");
    }
    
    function test_StateTransition_ResolvedToSettled() public {
        vm.startPrank(factory);
        episode.open();
        episode.lock();
        vm.stopPrank();
        
        vm.prank(oracle);
        episode.resolve(true, ESTIMATED_ARRIVAL + 3 hours);
        
        episode.settle();
        
        assertEq(uint(episode.state()), uint(IEpisode.EpisodeState.Settled), "State should be Settled");
    }
    
    function test_StateTransition_RevertsOnInvalidTransition() public {
        // Try to lock before opening
        vm.startPrank(factory);
        vm.expectRevert(Errors.InvalidState.selector);
        episode.lock();
        vm.stopPrank();
    }
    
    /* ========== Join Tests ========== */
    
    function test_Join_EnforcesPremiumAmount() public {
        vm.prank(factory);
        episode.open();
        
        // Try to join with wrong amount
        vm.startPrank(user1);
        vm.expectRevert(Errors.InvalidAmount.selector);
        episode.join{value: PREMIUM_AMOUNT - 0.1 ether}();
        vm.stopPrank();
        
        // Join with correct amount
        vm.prank(user1);
        episode.join{value: PREMIUM_AMOUNT}();
        
        assertEq(episode.premiumOf(user1), PREMIUM_AMOUNT, "Premium should be recorded");
    }
    
    function test_Join_UpdatesTotalPremium() public {
        vm.prank(factory);
        episode.open();
        
        vm.prank(user1);
        episode.join{value: PREMIUM_AMOUNT}();
        
        assertEq(episode.totalPremium(), PREMIUM_AMOUNT, "Total premium should be updated");
        
        vm.prank(user2);
        episode.join{value: PREMIUM_AMOUNT}();
        
        assertEq(episode.totalPremium(), PREMIUM_AMOUNT * 2, "Total premium should accumulate");
    }
    
    function test_Join_EmitsEvent() public {
        vm.prank(factory);
        episode.open();
        
        vm.expectEmit(true, false, false, true);
        emit MemberJoined(user1, PREMIUM_AMOUNT);
        
        vm.prank(user1);
        episode.join{value: PREMIUM_AMOUNT}();
    }
    
    function test_Join_RevertsWhenAlreadyJoined() public {
        vm.prank(factory);
        episode.open();
        
        vm.startPrank(user1);
        episode.join{value: PREMIUM_AMOUNT}();
        
        vm.expectRevert(Errors.AlreadyJoined.selector);
        episode.join{value: PREMIUM_AMOUNT}();
        vm.stopPrank();
    }
    
    /* ========== Settlement Tests ========== */
    
    function test_Settle_CalculatesPayoutWhenEventOccurred() public {
        // Setup: 3 users join
        vm.prank(factory);
        episode.open();
        
        vm.prank(user1);
        episode.join{value: PREMIUM_AMOUNT}();
        vm.prank(user2);
        episode.join{value: PREMIUM_AMOUNT}();
        vm.prank(user3);
        episode.join{value: PREMIUM_AMOUNT}();
        
        vm.prank(factory);
        episode.lock();
        
        // Resolve with event occurred
        vm.prank(oracle);
        episode.resolve(true, ESTIMATED_ARRIVAL + 3 hours);
        
        episode.settle();
        
        // Expected: 3 members * 2 ether payout = 6 ether total payout
        // Total premium = 3 ether
        // Since payout > premium, totalPayout should be capped at totalPremium (3 ether)
        assertEq(episode.totalPayout(), 3 ether, "Total payout should be capped at total premium");
        assertEq(episode.surplus(), 0, "Surplus should be 0 when payout uses all premium");
    }
    
    function test_Settle_CalculatesSurplusWhenEventNotOccurred() public {
        // Setup: 3 users join
        vm.prank(factory);
        episode.open();
        
        vm.prank(user1);
        episode.join{value: PREMIUM_AMOUNT}();
        vm.prank(user2);
        episode.join{value: PREMIUM_AMOUNT}();
        vm.prank(user3);
        episode.join{value: PREMIUM_AMOUNT}();
        
        vm.prank(factory);
        episode.lock();
        
        // Resolve with event NOT occurred
        vm.prank(oracle);
        episode.resolve(false, ESTIMATED_ARRIVAL + 1 hours);
        
        episode.settle();
        
        // Expected: no payout, all premium becomes surplus
        assertEq(episode.totalPayout(), 0, "Total payout should be 0 when event didn't occur");
        assertEq(episode.surplus(), 3 ether, "Surplus should equal total premium");
    }
    
    function test_Settle_HandlesPayoutSmallerThanPremium() public {
        // Create episode where payout < total premium (1 member, 1 ether premium, 2 ether payout cap)
        vm.prank(factory);
        Episode smallEpisode = new Episode(
            oracle,
            5 ether,  // High premium
            1 ether,  // Low payout
            FLIGHT_NAME,
            DEPARTURE_TIME,
            ESTIMATED_ARRIVAL
        );
        
        vm.prank(factory);
        smallEpisode.open();
        
        vm.prank(user1);
        smallEpisode.join{value: 5 ether}();
        vm.prank(user2);
        smallEpisode.join{value: 5 ether}();
        
        vm.prank(factory);
        smallEpisode.lock();
        
        vm.prank(oracle);
        smallEpisode.resolve(true, ESTIMATED_ARRIVAL + 3 hours);
        
        smallEpisode.settle();
        
        // 2 members * 1 ether = 2 ether payout, 10 ether premium - 2 ether payout = 8 ether surplus
        assertEq(smallEpisode.totalPayout(), 2 ether, "Total payout should be 2 ether");
        assertEq(smallEpisode.surplus(), 8 ether, "Surplus should be 8 ether");
    }
    
    /* ========== Claim Tests ========== */
    
    function test_Claim_PaysOutCorrectAmount() public {
        // Create episode where payout amount <= available premium
        // Use lower payout amount so contract has sufficient funds
        vm.prank(factory);
        Episode testEpisode = new Episode(
            oracle,
            2 ether,  // Premium
            1 ether,  // Payout (lower than premium)
            FLIGHT_NAME,
            DEPARTURE_TIME,
            ESTIMATED_ARRIVAL
        );
        
        // Setup - use contract that can receive ETH
        EthReceiver receiver = new EthReceiver();
        address payable user = payable(address(receiver));
        vm.deal(user, 10 ether);
        
        vm.prank(factory);
        testEpisode.open();
        
        vm.prank(user);
        testEpisode.join{value: 2 ether}();
        
        vm.prank(factory);
        testEpisode.lock();
        
        vm.prank(oracle);
        testEpisode.resolve(true, ESTIMATED_ARRIVAL + 3 hours);
        
        testEpisode.settle();
        
        uint256 balanceBefore = user.balance;
        
        vm.prank(user);
        testEpisode.claim();
        
        uint256 balanceAfter = user.balance;
        
        // User should receive PAYOUT_AMOUNT
        assertEq(balanceAfter - balanceBefore, 1 ether, "User should receive the payout amount");
    }
    
    function test_Claim_RevertsWhenEventNotOccurred() public {
        vm.prank(factory);
        episode.open();
        
        vm.prank(user1);
        episode.join{value: PREMIUM_AMOUNT}();
        
        vm.prank(factory);
        episode.lock();
        
        vm.prank(oracle);
        episode.resolve(false, ESTIMATED_ARRIVAL);
        
        episode.settle();
        
        vm.startPrank(user1);
        vm.expectRevert(Errors.NoPayoutAvailable.selector);
        episode.claim();
        vm.stopPrank();
    }
    
    function test_Claim_RevertsWhenAlreadyClaimed() public {
        // Create episode where payout amount <= available premium
        vm.prank(factory);
        Episode testEpisode = new Episode(
            oracle,
            2 ether,  // Premium
            1 ether,  // Payout (lower than premium)
            FLIGHT_NAME,
            DEPARTURE_TIME,
            ESTIMATED_ARRIVAL
        );
        
        // Setup - use contract that can receive ETH
        EthReceiver receiver = new EthReceiver();
        address payable user = payable(address(receiver));
        vm.deal(user, 10 ether);
        
        vm.prank(factory);
        testEpisode.open();
        
        vm.prank(user);
        testEpisode.join{value: 2 ether}();
        
        vm.prank(factory);
        testEpisode.lock();
        
        vm.prank(oracle);
        testEpisode.resolve(true, ESTIMATED_ARRIVAL + 3 hours);
        
        testEpisode.settle();
        
        vm.startPrank(user);
        testEpisode.claim();
        
        vm.expectRevert(Errors.AlreadyClaimed.selector);
        testEpisode.claim();
        vm.stopPrank();
    }
    
    /* ========== Surplus Withdrawal Tests ========== */
    
    function test_WithdrawSurplus_ReturnsProportionalShare() public {
        // Setup - use contracts that can receive ETH
        EthReceiver receiverA = new EthReceiver();
        EthReceiver receiverB = new EthReceiver();
        address payable userA = payable(address(receiverA));
        address payable userB = payable(address(receiverB));
        vm.deal(userA, 10 ether);
        vm.deal(userB, 10 ether);
        
        vm.prank(factory);
        episode.open();
        
        vm.prank(userA);
        episode.join{value: PREMIUM_AMOUNT}();
        vm.prank(userB);
        episode.join{value: PREMIUM_AMOUNT}();
        
        vm.prank(factory);
        episode.lock();
        
        vm.prank(oracle);
        episode.resolve(false, ESTIMATED_ARRIVAL);
        
        episode.settle();
        
        uint256 balanceBefore = userA.balance;
        
        vm.prank(userA);
        episode.withdrawSurplus();
        
        uint256 balanceAfter = userA.balance;
        
        // User1 should get their full premium back
        assertEq(balanceAfter - balanceBefore, PREMIUM_AMOUNT, "User should receive their premium back");
    }
    
    function test_WithdrawSurplus_RevertsWhenEventOccurred() public {
        vm.prank(factory);
        episode.open();
        
        vm.prank(user1);
        episode.join{value: PREMIUM_AMOUNT}();
        
        vm.prank(factory);
        episode.lock();
        
        vm.prank(oracle);
        episode.resolve(true, ESTIMATED_ARRIVAL + 3 hours);
        
        episode.settle();
        
        vm.startPrank(user1);
        vm.expectRevert(Errors.NoSurplusAvailable.selector);
        episode.withdrawSurplus();
        vm.stopPrank();
    }
}
