// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";

/**
 * @title InsuranceContract
 * @notice Individual flight delay insurance contract using Chainlink Functions
 * @dev Uses Chainlink Functions to check flight status from aviation APIs
 */
contract InsuranceContract is FunctionsClient {
    using FunctionsRequest for FunctionsRequest.Request;
    
    // Contract participants
    address public immutable insurer;
    address public immutable client;
    
    // Flight details
    string public flightNumber;
    uint256 public departureTime;
    uint256 public delayThreshold; // in minutes
    
    // Financial terms
    uint256 public premium;
    uint256 public payoutValue;
    
    // Contract state
    bool public contractActive;
    bool public contractPaid;
    uint256 public requestCount;
    uint256 public lastCheckTime;
    
    // Flight status data
    uint256 public actualDepartureTime;
    uint256 public delayMinutes;
    
    // Chainlink configuration
    LinkTokenInterface public immutable linkToken;
    uint64 public immutable subscriptionId;
    uint32 public constant GAS_LIMIT = 300000;
    bytes32 public donId;
    
    // Latest request
    bytes32 public lastRequestId;
    
    // Events
    event FlightStatusRequested(bytes32 indexed requestId, uint256 timestamp);
    event FlightStatusReceived(
        bytes32 indexed requestId,
        uint256 delay,
        uint256 actualDeparture
    );
    event ContractPaidOut(uint256 timestamp, uint256 amount);
    event ContractEnded(uint256 timestamp);
    
    // Modifiers
    modifier onlyInsurer() {
        require(msg.sender == insurer, "Only insurer can call");
        _;
    }
    
    modifier onlyActive() {
        require(contractActive, "Contract not active");
        _;
    }
    
    /**
     * @notice Constructor
     */
    constructor(
        address _client,
        string memory _flightNumber,
        uint256 _departureTime,
        uint256 _premium,
        uint256 _payoutValue,
        uint256 _delayThreshold,
        address _link,
        address _router,
        uint256 _oraclePayment
    ) payable FunctionsClient(_router) {
        require(_client != address(0), "Invalid client");
        require(msg.value > 0, "Must send ETH");
        
        insurer = msg.sender;
        client = _client;
        flightNumber = _flightNumber;
        departureTime = _departureTime;
        premium = _premium;
        payoutValue = _payoutValue;
        delayThreshold = _delayThreshold;
        linkToken = LinkTokenInterface(_link);
        contractActive = true;
        
        // Note: In production, you would set subscriptionId and donId
        // For this example, these would be configured after deployment
    }
    
    /**
     * @notice Set Chainlink Functions configuration
     * @dev Must be called after contract creation
     */
    function setChainlinkConfig(uint64 _subscriptionId, bytes32 _donId) 
        external 
        onlyInsurer 
    {
        require(subscriptionId == 0, "Already configured");
        subscriptionId = _subscriptionId;
        donId = _donId;
    }
    
    /**
     * @notice Check flight status using Chainlink Functions
     */
    function checkFlightStatus() external onlyActive returns (bytes32) {
        require(
            block.timestamp >= departureTime - 2 hours,
            "Too early to check"
        );
        require(
            block.timestamp <= departureTime + 24 hours,
            "Too late to check"
        );
        require(
            block.timestamp >= lastCheckTime + 1 hours,
            "Checked too recently"
        );
        
        // JavaScript source code to fetch flight data
        // This would call aviation APIs like AviationStack, FlightAware, etc.
        string memory source = string(
            abi.encodePacked(
                "const flightNumber = args[0];",
                "const departureTime = args[1];",
                "const apiKey = secrets.apiKey;",
                "const url = `https://api.aviationstack.com/v1/flights?access_key=${apiKey}&flight_iata=${flightNumber}`;",
                "const response = await Functions.makeHttpRequest({ url });",
                "if (response.error) throw new Error('API request failed');",
                "const data = response.data.data[0];",
                "if (!data) return Functions.encodeUint256(0);",
                "const scheduledDep = new Date(data.departure.scheduled).getTime();",
                "const actualDep = new Date(data.departure.actual || data.departure.estimated).getTime();",
                "const delayMs = actualDep - scheduledDep;",
                "const delayMinutes = Math.max(0, Math.floor(delayMs / 60000));",
                "return Functions.encodeUint256(delayMinutes);"
            )
        );
        
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source);
        
        // Set arguments
        string[] memory args = new string[](2);
        args[0] = flightNumber;
        args[1] = _uint2str(departureTime);
        req.setArgs(args);
        
        // Note: In production, you would add encrypted secrets here
        // req.addSecretsReference(encryptedSecretsReference);
        
        // Send request
        lastRequestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            GAS_LIMIT,
            donId
        );
        
        lastCheckTime = block.timestamp;
        requestCount++;
        
        emit FlightStatusRequested(lastRequestId, block.timestamp);
        
        return lastRequestId;
    }
    
    /**
     * @notice Chainlink Functions callback
     */
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        require(requestId == lastRequestId, "Invalid request");
        require(err.length == 0, "Request failed");
        
        // Decode response (delay in minutes)
        delayMinutes = abi.decode(response, (uint256));
        
        emit FlightStatusReceived(requestId, delayMinutes, actualDepartureTime);
        
        // Check if payout condition is met
        if (delayMinutes >= delayThreshold) {
            _payoutContract();
        } else if (block.timestamp > departureTime + 24 hours) {
            // Flight completed without significant delay
            _endContract();
        }
    }
    
    /**
     * @notice Pay out the insurance claim
     */
    function _payoutContract() private onlyActive {
        contractActive = false;
        contractPaid = true;
        
        // Transfer payout to client
        (bool success, ) = client.call{value: address(this).balance}("");
        require(success, "Payout transfer failed");
        
        // Return remaining LINK to insurer
        uint256 linkBalance = linkToken.balanceOf(address(this));
        if (linkBalance > 0) {
            require(
                linkToken.transfer(insurer, linkBalance),
                "LINK transfer failed"
            );
        }
        
        emit ContractPaidOut(block.timestamp, payoutValue);
    }
    
    /**
     * @notice End contract without payout
     */
    function _endContract() private onlyActive {
        contractActive = false;
        
        // Return funds to insurer
        (bool success, ) = insurer.call{value: address(this).balance}("");
        require(success, "Refund transfer failed");
        
        // Return LINK to insurer
        uint256 linkBalance = linkToken.balanceOf(address(this));
        if (linkBalance > 0) {
            require(
                linkToken.transfer(insurer, linkBalance),
                "LINK transfer failed"
            );
        }
        
        emit ContractEnded(block.timestamp);
    }
    
    /**
     * @notice Manual contract cancellation (only before departure time)
     */
    function cancelContract() external onlyInsurer onlyActive {
        require(
            block.timestamp < departureTime - 24 hours,
            "Too late to cancel"
        );
        _endContract();
    }
    
    /**
     * @notice Helper function to convert uint to string
     */
    function _uint2str(uint256 _i) private pure returns (string memory) {
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
    
    receive() external payable {}
}