// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Episode.sol";

contract EpisodeFactory {
    address public owner;
    address public oracle;

    struct EpisodeInfo {
        address episode;
        bytes32 productId;
        uint64 signupStart;
        uint64 signupEnd;
    }

    EpisodeInfo[] public episodes;
    mapping(address => bool) public isEpisode;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address _oracle) {
        owner = msg.sender;
        oracle = _oracle;
    }

    /* ========== Episode Creation ========== */

    function createEpisode(
        bytes32 productId,
        uint64 signupStart,
        uint64 signupEnd
    )
        external
        onlyOwner
        returns (address)
    {
        require(signupStart < signupEnd, "Invalid signup window");

        Episode episode = new Episode(oracle);
        address ep = address(episode);

        episodes.push(
            EpisodeInfo({
                episode: ep,
                productId: productId,
                signupStart: signupStart,
                signupEnd: signupEnd
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
        require(isEpisode[ep], "Unknown episode");
        Episode(ep).open();
    }

    function lockEpisode(address ep)
        external
        onlyOwner
    {
        require(isEpisode[ep], "Unknown episode");
        Episode(ep).lock();
    }

    function closeEpisode(address ep)
        external
        onlyOwner
    {
        require(isEpisode[ep], "Unknown episode");
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
