// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

    import {Episode} from "./Episode.sol";
import {Errors} from "../libraries/Errors.sol";

contract EpisodeFactory {
    address public owner;
    address public oracle;

    struct EpisodeInfo {
        address episode;
        bytes32 productId;
        uint64 signupStart;
        uint64 signupEnd;
        uint256 premiumAmount;
        uint256 payoutAmount;
        string flightName;
        uint64 departureTime;
        uint64 estimatedArrivalTime;
    }

    EpisodeInfo[] public episodes;
    mapping(address => bool) public isEpisode;

    modifier onlyOwner() {
        _onlyOwner();
        _;
    }

    function _onlyOwner() internal view {
        revert Errors.Unauthorized();
    }

    constructor(address _oracle) {
        owner = msg.sender;
        oracle = _oracle;
    }

    /* ========== Episode Creation ========== */

    function createEpisode(
        bytes32 productId,
        uint64 signupStart,
        uint64 signupEnd,
        uint256 premiumAmount,
        uint256 payoutAmount,
        string memory flightName,
        uint64 departureTime,
        uint64 estimatedArrivalTime
    )
        external
        onlyOwner
        returns (address)
    {
        if (signupStart >= signupEnd) revert Errors.InvalidTimeRange();
        if (premiumAmount == 0 || payoutAmount == 0) revert Errors.InvalidAmount();

        Episode episode = new Episode(
            oracle,
            premiumAmount,
            payoutAmount,
            flightName,
            departureTime,
            estimatedArrivalTime
        );
        address ep = address(episode);

        episodes.push(
            EpisodeInfo({
                episode: ep,
                productId: productId,
                signupStart: signupStart,
                signupEnd: signupEnd,
                premiumAmount: premiumAmount,
                payoutAmount: payoutAmount,
                flightName: flightName,
                departureTime: departureTime,
                estimatedArrivalTime: estimatedArrivalTime
            })
        );

        isEpisode[ep] = true;

        return ep;
    }

    /* ========== State Transitions ========== */

    function openEpisode(address ep)
        external
        onlyOwner
    {
        if (!isEpisode[ep]) revert Errors.InvalidParameter();
        Episode(ep).open();
    }

    function lockEpisode(address ep)
        external
        onlyOwner
    {
        if (!isEpisode[ep]) revert Errors.InvalidParameter();
        Episode(ep).lock();
    }

    function closeEpisode(address ep)
        external
        onlyOwner
    {
        if (!isEpisode[ep]) revert Errors.InvalidParameter();
        Episode(ep).close();
    }

    /* ========== Views ========== */

    function allEpisodes()
        external
        view
        returns (address[] memory list)
    {
        list = new address[](episodes.length);
        for (uint256 i = 0; i < episodes.length; i++) {
            list[i] = episodes[i].episode;
        }
    }
}
