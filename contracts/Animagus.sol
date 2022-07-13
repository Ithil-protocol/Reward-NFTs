// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/draft-ERC721Votes.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Animagus is Ownable, ERC721, ERC721Enumerable, ERC721Burnable, ERC721Royalty, EIP712, ERC721Votes {
    using Counters for Counters.Counter;

    struct Shape {
        string base;
        string transformed;
    }
    mapping(uint256 => Shape) private tokenURIs;
    Counters.Counter private _tokenIdCounter;
    
    constructor(
        address _artist,
        uint96 _fee
    )
    ERC721("Ithil Animagus", "Animagus") EIP712("Animagus", "1") {
        _setDefaultRoyalty(_artist, _fee);
    }

    function mintTo(address to, string memory _baseUrl, string memory _baseUrlTransformed) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        tokenURIs[tokenId] = Shape(_baseUrl, _baseUrlTransformed);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _afterTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Votes)
    {
        super._afterTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721Royalty) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721)
        returns (string memory)
    {                
        if(block.timestamp % 86400 < 43200)
            return tokenURIs[tokenId].base;
        else 
            return tokenURIs[tokenId].transformed;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721Royalty)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
