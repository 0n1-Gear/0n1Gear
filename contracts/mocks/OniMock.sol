pragma solidity ^0.8.6;

contract OniMock {
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

    function balanceOf(address owner) external view returns (uint256) {
        return ownedTokensMap[owner].length;
    }
}
