pragma solidity ^0.8.6;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract OniMock is ERC721URIStorage{
    mapping(address => uint256[]) ownedTokensMap;

    function setOwnerOnis(address owner, uint256[] calldata tokenIds) external {
        ownedTokensMap[owner] = tokenIds;
    }

    function tokenOfOwnerByIndex(address owner, uint256 index)
        external
        view
        returns (uint256 tokenId)
    {
        uint256[] memory ownedTokens = ownedTokensMap[owner];
        return ownedTokens[index];
    }

    function balanceOf(address owner) public override view returns (uint256) {
        return ownedTokensMap[owner].length;
    }
     constructor(string memory name, string memory symbol) ERC721(name, symbol) {}
}
