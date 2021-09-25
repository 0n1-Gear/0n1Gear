pragma solidity ^0.8.6;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "base64-sol/base64.sol";
import "./mocks/OniMock.sol";
import "hardhat/console.sol";

contract OniGear is ERC721URIStorage, ReentrancyGuard, Ownable {
    // @dev - copied from ON1 contract as poss variables
    uint256 public constant ONI_GIFT = 300;
    uint256 public constant ONI_PUBLIC = 7_700;
    uint256 public constant ONI_MAX = ONI_GIFT + ONI_PUBLIC;
    uint256 public constant PURCHASE_LIMIT = 7;
    bool public activated;
    bool public isAllowListActive;
    uint256 public constant PRICE_ONI = 0.01 ether;
    uint256 public constant PRICE_PUBLIC = 0.05 ether;

    uint256 private _tokenCount;
    address private _oniAddress;
    IERC721Enumerable private _oniContract;
    mapping(uint256 => bool) private _claimedList;
    mapping(bytes32 => bytes32[]) private lookups;

    // Optimise all variables using bytes32 instead of strings. Can't seem to initialise an array of bytes32 so have to create them individually
    // and add to mapping at construction. Seems most gas efficient as contract gas heavy due to everything on chain
    bytes32 private constant PRIMARY_WEAPON_CATEGORY = "PRIMARY WEAPON";
    bytes32 private constant SECONDARY_WEAPON_CATEGORY = "SECONDARY WEAPON";
    bytes32 private constant WAIST_CATEGORY = "WAIST";
    bytes32 private constant HAND_CATEGORY = "HAND";
    bytes32 private constant FEET_CATEGORY = "FEET";
    bytes32 private constant RINGS_CATEGORY = "RINGS";
    bytes32 private constant TITLE_CATEGORY = "TITLE";

    //POSSIBLE FOR ALL CATEGORIES
    bytes32 private constant NONE = "<none>";

    //MIXED PRIMARY OR SECONDARY (OR BOTH) WEAPONS
    bytes32 private constant M_WEAPON_1 = "Katana";
    bytes32 private constant M_WEAPON_2 = "Handgun";
    bytes32 private constant M_WEAPON_3 = "Dagger";
    bytes32 private constant M_WEAPON_4 = "Kunai";
    bytes32 private constant M_WEAPON_5 = "Riot Gun";
    bytes32 private constant M_WEAPON_6 = "Collapsible Baton";
    bytes32 private constant M_WEAPON_7 = "Sai";

    //PRIMARY WEAPONS
    bytes32 private constant P_WEAPON_1 = "Naginata";
    bytes32 private constant P_WEAPON_2 = "Quarterstafff";
    bytes32 private constant P_WEAPON_3 = "Kukri";
    bytes32 private constant P_WEAPON_4 = "Mech Glove";
    bytes32 private constant P_WEAPON_5 = "Sledgehammer";
    bytes32 private constant P_WEAPON_6 = "Whip";
    bytes32 private constant P_WEAPON_7 = "Rope Dart";
    bytes32 private constant P_WEAPON_8 = "Slingshot";
    bytes32 private constant P_WEAPON_9 = "Longbow";
    bytes32 private constant P_WEAPON_10 = "Crossbow";
    bytes32 private constant P_WEAPON_11 = "Pipe";

    //SECONDARY WEAPONS
    bytes32 private constant S_WEAPON_1 = "Smoke grenades";
    bytes32 private constant S_WEAPON_2 = "Tear gas canisters";
    bytes32 private constant S_WEAPON_3 = "Mustard gas canisters";
    bytes32 private constant S_WEAPON_4 = "Flashbang";
    bytes32 private constant S_WEAPON_5 = "Neurogas grenades";
    bytes32 private constant S_WEAPON_6 = "Micromolecular Wire";
    bytes32 private constant S_WEAPON_7 = "Poision Darts";
    bytes32 private constant S_WEAPON_8 = "Spider Drones";
    bytes32 private constant S_WEAPON_9 = "Garrotte";

    //WAIST ITEMS
    bytes32 private constant WAIST_1 = "Tactical belt";
    bytes32 private constant WAIST_2 = "Leg harness";
    bytes32 private constant WAIST_3 = "Belt bag";
    bytes32 private constant WAIST_4 = "Paracord";
    bytes32 private constant WAIST_5 = "Obi";

    //HANDS ITEMS
    bytes32 private constant HANDS_SUFFIX = "Gloves";
    bytes32 private constant HANDS_1 = "Leather";
    bytes32 private constant HANDS_2 = "Surgical";
    bytes32 private constant HANDS_3 = "Suede";
    bytes32 private constant HANDS_4 = "Silk";
    bytes32 private constant HANDS_5 = "Spiked";
    bytes32 private constant HANDS_6 = "Metal/plate";
    bytes32 private constant HANDS_7 = "Knuckled";
    bytes32 private constant HANDS_8 = "Lace";
    bytes32 private constant HANDS_9 = "Razor Claw";

    //FEET ITEMS
    bytes32 private constant FEET_1 = "Leather Boots";
    bytes32 private constant FEET_2 = "Steel-toed Boots";
    bytes32 private constant FEET_3 = "Spring/booster Shoes";
    bytes32 private constant FEET_4 = "Jika-tabi";
    bytes32 private constant FEET_5 = "Suede Shoes";
    bytes32 private constant FEET_6 = "Slippers";

    //RINGS
    bytes32 private constant RING_SUFFIX = "Ring";
    bytes32 private constant RING_1 = "Ao";
    bytes32 private constant RING_2 = "Aka";
    bytes32 private constant RING_3 = "Kiiro";

    //SPECIAL TITLE
    bytes32 private constant KONOE_SHIDAN = "Konoe Shidan";

    bytes32[] private categories = [
        PRIMARY_WEAPON_CATEGORY,
        SECONDARY_WEAPON_CATEGORY,
        WAIST_CATEGORY,
        HAND_CATEGORY,
        FEET_CATEGORY,
        RINGS_CATEGORY,
        TITLE_CATEGORY
    ];

    string[] private suffixes = [
        "of Style",
        "of Spirit",
        "of Strength",
        "of Mastery",
        "of Wisdom",
        "of Harmony",
        "of Aura",
        "of Shadow",
        "of Void",
        "of the Shift",
        "of the Fallen",
        "of the Favoured",
        "of the Supreme",
        "of the Kami",
        "of the Siblings",
        "of the Emperor"
    ];

    string[] private namePrefixes = [
        "Abhorrent",
        "Alluring",
        "Ancient",
        "Ashes",
        "Blessed",
        "Beaming",
        "Baneful",
        "Bloodthirsty",
        "Barbaric",
        "Brutal",
        "Butcher",
        "Calamity",
        "Carnal",
        "C4N4RY's",
        "Ceaseless",
        "Corporeal",
        "Courage",
        "Cryogenic",
        "Damned",
        "Dawn",
        "D34TH's",
        "Dishonored",
        "Divine",
        "Dusk",
        "Dreadful",
        "Eery",
        "Eldritch",
        "Enigma",
        "Forgotten",
        "Frost",
        "Ghost",
        "Glory",
        "Gnarled",
        "God",
        "Grace",
        "Heartrending",
        "Horror",
        "Hex",
        "Howling",
        "Ilussive",
        "Lethal",
        "Malice",
        "Massacre",
        "Mirage",
        "Nameless",
        "Nightfall",
        "Nightmare",
        "Nirvana",
        "Nemesis",
        "Nether",
        "Oath",
        "Peace",
        "Purgatory",
        "Prophecy",
        "Phantom",
        "Thunder",
        "Silent",
        "Phantom",
        "Luminous",
        "Awakened",
        "Iridescent",
        "Aura",
        "Syndicate",
        "R0S3's"
        "J3ST3R's",
        "WR1T3R's",
        "M33Kasa's",
        "L1NK's"
    ];

    string[] private nameSuffixes = [
        "Grasp",
        "Whisper",
        "Shadow",
        "Torment",
        "Will",
        "Tears",
        "Calling",
        "Sun",
        "Moon",
        "Despair",
        "Song",
        "Pursuit",
        "Rage",
        "Lullaby",
        "Dream",
        "Kiss",
        "Lust",
        "Beacon",
        "Binder",
        "Remorse",
        "Delusion"
    ];

    function random(string memory seed, uint256 offset) internal pure returns (uint256) {
        return uint8(uint256(keccak256(abi.encodePacked(seed, toString(offset)))));
    }
function getRandomGaussianNumbers(string memory seed) public pure returns (uint256[8] memory) {
        uint256[8] memory numbers;
        for (uint8 i = 0; i < 8; ++i) {
            int64 accumulator = 0;
            for (uint8 j = 0; j < 16; ++j) {
                uint8 offset = (i * 16) + j;
                accumulator += int64(uint64(random(seed, offset)));
            }

            accumulator *= 10000;
            accumulator /= 16;
            accumulator = accumulator - 1270000;
            accumulator *= 10000;
            accumulator /= 733235;
            accumulator *= 8;
            accumulator += 105000;
            accumulator /= 10000;
            numbers[i] = uint256(uint64(accumulator));
        }
        return numbers;
}
    function pluck(uint256 tokenId, bytes32 keyPrefix, uint greatness)
        internal
        view
        returns (string memory)
    {
        bytes32[] memory sourceArray = lookups[keyPrefix];
        uint256 rand = random(string(abi.encodePacked(keyPrefix)),tokenId);
        string memory output = string(
            abi.encodePacked(sourceArray[rand % sourceArray.length])
        );
        // console.log(
        //     "greatness = ",
        //     greatness,
        //     string(abi.encodePacked(keyPrefix))
        // );
        if (keyPrefix == HAND_CATEGORY) {
            output = string(abi.encodePacked(output, " ", HANDS_SUFFIX));
        }
        if (keyPrefix == RINGS_CATEGORY) {
            output = string(abi.encodePacked(output, " ", RING_SUFFIX));
        }
        //In this case, only return where max greatness
        if (keyPrefix == TITLE_CATEGORY) {
            if (greatness > 15) {
                return string(abi.encodePacked(KONOE_SHIDAN));
            } else {
                return "";
            }
        } else {
            if (greatness > 12 || greatness < 8) {
                output = string(
                    abi.encodePacked(
                        output,
                        " ",
                        suffixes[rand % suffixes.length]
                    )
                );
            }
            if (greatness > 13 || greatness <7) {
                string[2] memory name;
                name[0] = namePrefixes[rand % namePrefixes.length];
                name[1] = nameSuffixes[rand % nameSuffixes.length];
                if (greatness > 14 || greatness <6) {
                    output = string(abi.encodePacked(output, " +1"));
                }
                output = string(
                    abi.encodePacked(output, ', "', name[0], " ", name[1], '"')
                );
            }
            return output;
        }
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        uint[8] memory greatnessArray = getRandomGaussianNumbers(string(abi.encodePacked(tokenId)));
        //Optimise the tokenURI process by making a loop and using variables stored in mapping
        string[16] memory parts;
        parts[
            0
        ] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: white; font-family: serif; font-size: 14px; }</style><rect width="100%" height="100%" fill="black" /><text x="10" y="20" class="base">';
        for (uint256 i = 0; i < 7; i++) {
            uint256 position = i * 2 + 1;
            parts[position] = pluck(tokenId, categories[i], greatnessArray[i]);
            parts[position + 1] = string(
                abi.encodePacked(
                    '</text><text x="10" y="',
                    toString((position + 2) * 20),
                    '" class="base">'
                )
            );
        }

        parts[15] = "</text></svg>";

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
                parts[15]
            )
        );

        // console.log(output);
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "Gear #',
                        tokenId,
                        '", "description": "0N1 Gear is a derivative of Loot for 0N1 Force with randomized  gear generated and stored on chain.", "image": "data:image/svg+xml;base64,',
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

    function setIsActive(bool _isActive) external onlyOwner {
        activated = _isActive;
    }

    function setIsAllowListActive(bool _isAllowListActive) external onlyOwner {
        isAllowListActive = _isAllowListActive;
    }

    function purchase(uint256 numberOfTokens) external payable nonReentrant {
        require(activated, "Contract inactive");
        require(!isAllowListActive, "Only from Allow List");
        require(_tokenCount < ONI_PUBLIC, "All tokens minted");
        require(
            _tokenCount + numberOfTokens <= ONI_PUBLIC,
            "Purchase > ONI_PUBLIC"
        );
        require(PRICE_ONI * numberOfTokens <= msg.value, "ETH insufficient");
        require(numberOfTokens <= PURCHASE_LIMIT, "Too much On1Gear");
        for (uint256 i = 0; i < numberOfTokens; i++) {
            uint256 idToMint;
            //Want to start any token IDs at 1, not 0
            for (uint256 j = 1; j < ONI_PUBLIC + 1; j++) {
                if (!_claimedList[j]) {
                    idToMint = j;
                    //Add this here to ensure don't return the same value each time
                    _claimedList[j] = true;
                    break;
                }
            }
            _tokenCount++;
            _safeMint(msg.sender, idToMint);
        }
    }

    function setOniContractAddress(address oniAddress) external onlyOwner {
        _oniAddress = oniAddress;
        _oniContract = IERC721Enumerable(_oniAddress);
    }

    function getTokenIdsForOni(address owner)
        internal
        view
        returns (uint256[] memory tokenIds)
    {
        uint256 numberOfOnis = _oniContract.balanceOf(owner);
        require(numberOfOnis > 0, "No Tokens to mint");
        uint256[] memory tokenIdsToReturn = new uint256[](numberOfOnis);
        for (uint256 i = 0; i < numberOfOnis; i++) {
            tokenIdsToReturn[i] = _oniContract.tokenOfOwnerByIndex(owner, i);
        }
        return tokenIdsToReturn;
    }

    function claimAllTokens() external payable {
        require(activated, "Contract inactive");
        require(isAllowListActive, "Allow List inactive");
        require(_tokenCount < ONI_PUBLIC, "All tokens minted");
        uint256[] memory tokensOwnedByAddress = getTokenIdsForOni(msg.sender);

        // Loop through all tokens available to this address and calculate how many are unclaimed.
        // Removing items fom arrays in solidity isn't easy, hence not just mutating original array and removing taken elements.
        // Also can't create a dynamic new array so in order to validate costs etc need to run the loop twice. :facepalm.

        uint256 unclaimedOnis;
        for (uint256 j = 0; j < tokensOwnedByAddress.length; j++) {
            bool alreadyClaimed = _claimedList[tokensOwnedByAddress[j]];
            if (!alreadyClaimed) {
                unclaimedOnis++;
            }
        }
        require(unclaimedOnis > 0, "No Tokens left to mint");
        require(PRICE_ONI * unclaimedOnis <= msg.value, "ETH insufficient");

        for (uint256 j = 0; j < tokensOwnedByAddress.length; j++) {
            uint256 tokenId = tokensOwnedByAddress[j];
            bool alreadyClaimed = _claimedList[tokenId];
            if (!alreadyClaimed) {
                _tokenCount++;
                _claimedList[tokenId] = true;
                _safeMint(msg.sender, tokenId);
            }
        }
    }

    function claimToken(uint256 oniId) external payable {
        require(activated, "Contract inactive");
        require(isAllowListActive, "Allow List inactive");
        require(_tokenCount < ONI_PUBLIC, "All tokens minted");
        require(PRICE_ONI <= msg.value, "ETH insufficient");
        bool alreadyClaimed = _claimedList[oniId];
        require(!alreadyClaimed, "Already minted");
        uint256[] memory tokensOwnedByAddress = getTokenIdsForOni(msg.sender);
        bool isOwned = false;
        for (uint256 j = 0; j < tokensOwnedByAddress.length; j++) {
            uint256 oniToMatch = tokensOwnedByAddress[j];
            if (oniToMatch == oniId) {
                isOwned = true;
                break;
            }
        }
        require(isOwned, "Not authorised");
        _tokenCount++;
        _claimedList[oniId] = true;
        _safeMint(msg.sender, oniId);
    }

    function ownerClaim(uint256[] calldata oniIds) external onlyOwner {
        require(activated, "Contract inactive");
        // Loop twice to validate entire transaction OK
        for (uint256 i = 0; i < oniIds.length; i++) {
            uint256 oniId = oniIds[i];
            require(oniId > ONI_PUBLIC && oniId <= ONI_MAX, "Token ID invalid");
            bool alreadyClaimed = _claimedList[oniId];
            require(!alreadyClaimed, "Already minted");
        }
        for (uint256 i = 0; i < oniIds.length; i++) {
            uint256 oniId = oniIds[i];
            _tokenCount++;
            _claimedList[oniId] = true;
            _safeMint(owner(), oniId);
        }
    }

    constructor() ERC721("0N1 Gear", "0N1GEAR") Ownable() {
        //TODO create static data as bytes as more space efficient?
        lookups[categories[0]] = [
            M_WEAPON_1,
            M_WEAPON_2,
            M_WEAPON_3,
            M_WEAPON_4,
            M_WEAPON_5,
            M_WEAPON_6,
            M_WEAPON_7,
            P_WEAPON_1,
            P_WEAPON_2,
            P_WEAPON_3,
            P_WEAPON_4,
            P_WEAPON_5,
            P_WEAPON_6,
            P_WEAPON_7,
            P_WEAPON_8,
            P_WEAPON_9,
            P_WEAPON_10,
            P_WEAPON_11
        ];
        lookups[categories[1]] = [
            S_WEAPON_1,
            S_WEAPON_2,
            S_WEAPON_3,
            S_WEAPON_4,
            S_WEAPON_5,
            S_WEAPON_6,
            S_WEAPON_7,
            S_WEAPON_8,
            S_WEAPON_9,
            M_WEAPON_1,
            M_WEAPON_2,
            M_WEAPON_3,
            M_WEAPON_4,
            M_WEAPON_5,
            M_WEAPON_6,
            M_WEAPON_7
        ];
        lookups[categories[2]] = [WAIST_1, WAIST_2, WAIST_3, WAIST_4, WAIST_5];
        lookups[categories[3]] = [
            HANDS_1,
            HANDS_2,
            HANDS_3,
            HANDS_4,
            HANDS_5,
            HANDS_6,
            HANDS_7,
            HANDS_8,
            HANDS_9
        ];
        lookups[categories[4]] = [
            FEET_1,
            FEET_2,
            FEET_3,
            FEET_4,
            FEET_5,
            FEET_6
        ];
        lookups[categories[5]] = [RING_1, RING_2, RING_3];
        lookups[categories[6]] = [KONOE_SHIDAN];
    }

    function toString(uint256 value) internal pure returns (string memory) {
        // Inspired by OraclizeAPI's implementation - MIT license
        // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol

        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}
