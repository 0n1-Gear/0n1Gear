pragma solidity ^0.8.6;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "base64-sol/base64.sol";

contract OniGear is ERC721URIStorage, ReentrancyGuard, Ownable {
    uint private _tokenCount;

    // @dev - copied from ON1 contract as poss variables
    uint256 public constant ONI_GIFT = 77;
    uint256 public constant ONI_PUBLIC = 7_700;
    uint256 public constant ONI_MAX = ONI_GIFT + ONI_PUBLIC;
    uint256 public constant RESERVE = 233;
    uint256 public constant PURCHASE_LIMIT = 7;
    mapping(address => uint256) _allowList;

    bool public activated;
    bool public isAllowListActive;
    uint256 public constant PRICE_ONI = 0.01 ether;
    uint256 public constant PRICE_PUBLIC = 0.05 ether;

    bytes32 private weaponsBytes1 = '0x57617268616d6d6572';
    bytes32 private weaponsBytes2 = '0x517561727465727374616666';
    bytes32 private weaponsBytes3 = '0x426f6f6b';

    mapping(string => bytes32[]) private lookups;

function bytes32ToString(bytes32 _bytes32) public pure returns (string memory) {
        uint8 i = 0;
        while(i < 32 && _bytes32[i] != 0) {
            i++;
        }
        bytes memory bytesArray = new bytes(i);
        for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }

    //TODO - Currently the properties are linked to an ID which is deterministically the same each time it is run and not random. Consider random
    // properties and storing on chain in a mapping? Should the properties use the ID of the new token as the seed, or some sort of ID from the
    // original 0N1?

    string[] private categories = [
        "WEAPONS",
        "CHEST ARMOUR",
        "HEAD ARMOUR",
        "WAIST ARMOUR",
        "FOOT_ARMOUR",
        "HAND_ARMOUR",
        "NECKLACES",
        "RINGS"];

    string[] private suffixes = ["of Power", "of Giants", "of the Twins"];

    string[] private namePrefixes = [
        "Agony",
        "Apocalypse",
        "Armageddon",
        "Beast",
        "Behemoth",
        "Blight"
    ];

    string[] private nameSuffixes = ["Bane", "Root", "Moon"];

    function random(string memory input) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }

    function pluck(uint256 tokenId, string memory keyPrefix)
        internal
        view
        returns (string memory)
    {
        bytes32[] memory sourceArray = lookups[keyPrefix];
        uint256 rand = random(
            string(abi.encodePacked(keyPrefix, tokenId))
        );
        string memory output = bytes32ToString(sourceArray[rand % sourceArray.length]);
        uint256 greatness = rand % 21;
        if (greatness > 14) {
            output = string(
                abi.encodePacked(output, " ", suffixes[rand % suffixes.length])
            );
        }
        if (greatness >= 19) {
            string[2] memory name;
            name[0] = namePrefixes[rand % namePrefixes.length];
            name[1] = nameSuffixes[rand % nameSuffixes.length];
            if (greatness == 19) {
                output = string(
                    abi.encodePacked('"', name[0], " ", name[1], '" ', output)
                );
            } else {
                output = string(
                    abi.encodePacked(
                        '"',
                        name[0],
                        " ",
                        name[1],
                        '" ',
                        output,
                        " +1"
                    )
                );
            }
        }
        return output;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        string[17] memory parts;
        parts[
            0
        ] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: white; font-family: serif; font-size: 14px; }</style><rect width="100%" height="100%" fill="black" /><text x="10" y="20" class="base">';
        for (uint256 i = 1; i < 16; i += 2) {
            uint256 position = i;
            parts[position] = pluck(tokenId, categories[i - 1]);
            parts[position + 1] = string(
                abi.encodePacked(
                    '</text><text x="10" y="',
                    ((position + 1) * 20),
                    '" class="base">'
                )
            );
        }

        parts[16] = "</text></svg>";

        string memory output = string(
            abi.encodePacked(
                parts[0],
                parts[1],
                parts[2],
                parts[3],
                parts[4],
                parts[5],
                parts[6],
                parts[7],
                parts[8]
            )
        );
        output = string(
            abi.encodePacked(
                output,
                parts[9],
                parts[10],
                parts[11],
                parts[12],
                parts[13],
                parts[14],
                parts[15],
                parts[16]
            )
        );

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "Bag #',
                        tokenId,
                        '", "description": "0N1 Gear is a derivative of Loot for 0N1 Force with randomized adventurer gear generated and stored on chain.", "image": "data:image/svg+xml;base64,',
                        Base64.encode(bytes(output)),
                        '"}'
                    )
                )
            )
        );
        output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        return output;
    }

    function totalSupply() public view returns (uint256 supply) {
        return _tokenCount;
    }

    function purchase() external payable nonReentrant {
        require(activated, "Contract inactive");
        require(!isAllowListActive, "Only from Allow List");
        require(totalSupply() < ONI_MAX, "All tokens minted");
        _tokenCount++;
        //TODO - public purchase
    }

    function removeFromAllowList(address[] calldata addresses)
        external
        onlyOwner
    {
        for (uint256 i = 0; i < addresses.length; i++) {
            require(addresses[i] != address(0), "Can't add address");
            /// @dev We don't want to reset possible _allowListClaimed numbers.
            _allowList[addresses[i]] = 0;
        }
    }

    function addToAllowList(
        address[] calldata addresses,
        uint256[] calldata allowedNumber
    ) external onlyOwner {
        for (uint256 i = 0; i < addresses.length; i++) {
            require(addresses[i] != address(0), "Can't add address");
            _allowList[addresses[i]] = allowedNumber[i];
        }
    }

    function setIsActive(bool _isActive) external onlyOwner {
        activated = _isActive;
    }

    function setIsAllowListActive(bool _isAllowListActive) external onlyOwner {
        isAllowListActive = _isAllowListActive;
    }

    function claimAllowList(uint256 numberOfTokens) external payable {
        require(activated, "Contract inactive");
        require(isAllowListActive, "Allow List inactive");
        require(_allowList[msg.sender] > 0, "Not on Allow List");
        require(totalSupply() < ONI_MAX, "All tokens minted");
        require(
            numberOfTokens <= _allowList[msg.sender],
            "Too many tokens"
        );
        require(
            _tokenCount + numberOfTokens <= ONI_PUBLIC,
            "Purchase > ONI_PUBLIC"
        );
        require(
            PRICE_ONI * numberOfTokens <= msg.value,
            "ETH insufficient"
        );
        for (uint256 i = 0; i < numberOfTokens; i++) {
            _tokenCount++;
            _allowList[msg.sender] = _allowList[msg.sender] - 1;
            _safeMint(msg.sender, _tokenCount);
        }
    }

    constructor() ERC721("0N1 Gear", "0N1GEAR") Ownable() {
        lookups[categories[0]] = [weaponsBytes1, weaponsBytes2, weaponsBytes3];
        lookups[categories[1]] = [weaponsBytes1, weaponsBytes2, weaponsBytes3];
        lookups[categories[2]] = [weaponsBytes1, weaponsBytes2, weaponsBytes3];
        lookups[categories[3]] = [weaponsBytes1, weaponsBytes2, weaponsBytes3];
        lookups[categories[4]] = [weaponsBytes1, weaponsBytes2, weaponsBytes3];
        lookups[categories[5]] = [weaponsBytes1, weaponsBytes2, weaponsBytes3];
        lookups[categories[6]] = [weaponsBytes1, weaponsBytes2, weaponsBytes3];
        lookups[categories[7]] = [weaponsBytes1, weaponsBytes2, weaponsBytes3];
    }
}
