pragma solidity ^0.8.6;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "base64-sol/base64.sol";
import "hardhat/console.sol";

contract OniGear is ERC721URIStorage, ReentrancyGuard, Ownable {
    // @dev - copied from ON1 contract as poss variables
    uint256 public constant ONI_GIFT = 300;
    uint256 public constant ONI_PUBLIC = 7_700;
    uint256 public constant ONI_MAX = ONI_GIFT + ONI_PUBLIC;
    uint256 public constant PURCHASE_LIMIT = 7;
    bool public activated;
    bool public isAllowListActive;
    uint256 public constant PRICE_ONI = 0.025 ether;
    uint256 public constant PRICE_PUBLIC = 0.05 ether;

    uint256 private _tokenCount;
    address private _oniAddress;
    IERC721Enumerable private _oniContract;
    mapping(uint256 => bool) private _claimedList;
    mapping(bytes32 => bytes32[]) private lookups;

    // Optimise all variables using bytes32 instead of strings. Can't seem to initialise an array of bytes32 so have to create them individually
    // and add to mapping at construction. Seems most gas efficient as contract gas heavy due to everything on chain
    bytes32 private PRIMARY_WEAPON_CATEGORY = "PRIMARY WEAPON";
    bytes32 private SECONDARY_WEAPON_CATEGORY = "SECONDARY WEAPON";
    bytes32 private WAIST_CATEGORY = "WAIST";
    bytes32 private HAND_CATEGORY = "HAND";
    bytes32 private FEET_CATEGORY = "FEET";
    bytes32 private RINGS_CATEGORY = "RINGS";
    bytes32 private TITLE_CATEGORY = "TITLE";

    //MIXED PRIMARY OR SECONDARY (OR BOTH) WEAPONS
    bytes32 private M_WEAPON_1 = "Katana";
    bytes32 private M_WEAPON_2 = "Enegery bolt";
    bytes32 private M_WEAPON_3 = "Dagger";
    bytes32 private M_WEAPON_4 = "Tactical Staf";
    bytes32 private M_WEAPON_5 = "Neo Sai";
    bytes32 private M_WEAPON_6 = "Axe";

    //PRIMARY WEAPONS
    bytes32 private P_WEAPON_1 = "Naginata";
    bytes32 private P_WEAPON_2 = "Compound Bow";
    bytes32 private P_WEAPON_3 = "Kukri";
    bytes32 private P_WEAPON_4 = "Kanabo";
    bytes32 private P_WEAPON_5 = "Railgun";
    bytes32 private P_WEAPON_6 = "Odachi";

    //SECONDARY WEAPONS
    bytes32 private S_WEAPON_1 = "Suriken";
    bytes32 private S_WEAPON_2 = "Flame Talisman";
    bytes32 private S_WEAPON_3 = "Spider Drones";
    bytes32 private S_WEAPON_4 = "Tanto";
    bytes32 private S_WEAPON_5 = "Kunai";
    bytes32 private S_WEAPON_6 = "Nanite dust";

    //WAIST ITEMS
    bytes32 private WAIST_1 = "Tactical belt";
    bytes32 private WAIST_2 = "Leg harness";
    bytes32 private WAIST_3 = "Hip Pack";
    bytes32 private WAIST_4 = "Cyber Belt";
    bytes32 private WAIST_5 = "Obi";

    //HANDS ITEMS
    bytes32 private HANDS_SUFFIX = "Gloves";
    bytes32 private HANDS_1 = "Leather";
    bytes32 private HANDS_2 = "Surgical";
    bytes32 private HANDS_3 = "Techno";
    bytes32 private HANDS_4 = "Silk";
    bytes32 private HANDS_5 = "Spiked";
    bytes32 private HANDS_6 = "Mech";
    bytes32 private HANDS_7 = "Knuckled";
    bytes32 private HANDS_8 = "Hardened";

    //FEET ITEMS
    bytes32 private FEET_1 = "Rocker Boots";
    bytes32 private FEET_2 = "Formal Shoes";
    bytes32 private FEET_3 = "Techno Boots";
    bytes32 private FEET_4 = "Jika-tabi";
    bytes32 private FEET_5 = "Grav Sneakers";
    bytes32 private FEET_6 = "0N1 Force Ones";

    //RINGS
    bytes32 private RING_SUFFIX = "Ring";
    bytes32 private RING_1 = "Ao";
    bytes32 private RING_2 = "Aka";
    bytes32 private RING_3 = "Kiiro";

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

    bytes32 private SUFFIXES_1 = "of Style";
    bytes32 private SUFFIXES_2 = "of Spirit";
    bytes32 private SUFFIXES_3 = "of Strength";
    bytes32 private SUFFIXES_4 = "of Hope";
    bytes32 private SUFFIXES_5 = "of Skill";
    bytes32 private SUFFIXES_6 = "of Fury";
    bytes32 private SUFFIXES_7 = "of Lost Memories";
    bytes32 private SUFFIXES_8 = "of the Ebony Door";
    bytes32 private SUFFIXES_9 = "of the Fallen";
    bytes32 private SUFFIXES_10 = "of the Favoured";
    bytes32 private SUFFIXES_11 = "of the Supreme";
    bytes32 private SUFFIXES_12 = "of the Kami";
    bytes32 private SUFFIXES_13 = "of the Siblings";
    bytes32 private SUFFIXES_14 = "of the Emperor";

    bytes32[] private suffixes = [
        SUFFIXES_1,
        SUFFIXES_2,
        SUFFIXES_3,
        SUFFIXES_4,
        SUFFIXES_5,
        SUFFIXES_6,
        SUFFIXES_7,
        SUFFIXES_8,
        SUFFIXES_9,
        SUFFIXES_10,
        SUFFIXES_11,
        SUFFIXES_12,
        SUFFIXES_13,
        SUFFIXES_14
    ];
    bytes32 private PREFIXES_1 = "Ornate";
    bytes32 private PREFIXES_2 = "Bloodied";
    bytes32 private PREFIXES_3 = "Galvanized";
    bytes32 private PREFIXES_4 = "Ancient";
    bytes32 private PREFIXES_5 = "Obsidian";
    bytes32 private PREFIXES_6 = "Haunted";
    bytes32 private PREFIXES_7 = "Ethereal";
    bytes32 private PREFIXES_8 = "Enchanted";
    bytes32 private PREFIXES_9 = "Infernal";
    bytes32 private PREFIXES_10 = "Celestial";
    bytes32 private PREFIXES_11 = "Cursed";

    bytes32[] private prefixes = [
        PREFIXES_1,
        PREFIXES_2,
        PREFIXES_3,
        PREFIXES_4,
        PREFIXES_5,
        PREFIXES_6,
        PREFIXES_7,
        PREFIXES_8,
        PREFIXES_9,
        PREFIXES_10,
        PREFIXES_11
    ];

    bytes32 private NAME_PREFIX_1 = "J3ST3R's";
    bytes32 private NAME_PREFIX_2 = "WR1T3R's";
    bytes32 private NAME_PREFIX_3 = "M33Kasa's";
    bytes32 private NAME_PREFIX_4 = "L1NK's";
    bytes32 private NAME_PREFIX_5 = "C4N4RY's";
    bytes32 private NAME_PREFIX_6 = "R0S3's";
    bytes32 private NAME_PREFIX_7 = "D34TH's";
    bytes32 private NAME_PREFIX_8 = "Nameless";
    bytes32 private NAME_PREFIX_9 = "Illusive";
    bytes32 private NAME_PREFIX_10 = "Awakened";
    bytes32 private NAME_PREFIX_11 = "Forgotten";
    bytes32 private NAME_PREFIX_12 = "Damned";
    bytes32 private NAME_PREFIX_13 = "Dawn";
    bytes32 private NAME_PREFIX_14 = "Dusk";
    bytes32 private NAME_PREFIX_15 = "Fate";
    bytes32 private NAME_PREFIX_16 = "Howling";
    bytes32 private NAME_PREFIX_17 = "Brutal";
    bytes32 private NAME_PREFIX_18 = "Corporeal";
    bytes32 private NAME_PREFIX_19 = "Peace";
    bytes32 private NAME_PREFIX_20 = "Chaos";
    bytes32 private NAME_PREFIX_21 = "Thunder";
    bytes32 private NAME_PREFIX_22 = "Phantom";
    bytes32 private NAME_PREFIX_23 = "Oath";
    bytes32 private NAME_PREFIX_24 = "Luminous";
    bytes32 private NAME_PREFIX_25 = "Irredescent";
    bytes32 private NAME_PREFIX_26 = "Forsaken";
    bytes32 private NAME_PREFIX_27 = "Glory";
    bytes32 private NAME_PREFIX_28 = "Plague";
    bytes32 private NAME_PREFIX_29 = "Rebellious";
    bytes32 private NAME_PREFIX_30 = "Ceaseless";
    bytes32 private NAME_PREFIX_31 = "Dishonered";
    bytes32 private NAME_PREFIX_32 = "Silent";
    bytes32 private NAME_PREFIX_33 = "Fate";
    bytes32 private NAME_PREFIX_34 = "Bound";
    bytes32 private NAME_PREFIX_35 = "Divine";
    bytes32 private NAME_PREFIX_36 = "Eerie";
    bytes32 private NAME_PREFIX_37 = "Limitless";
    bytes32 private NAME_PREFIX_38 = "Quantum";
    bytes32 private NAME_PREFIX_39 = "Living";
    bytes32 private NAME_PREFIX_40 = "Bestial";
    bytes32 private NAME_PREFIX_41 = "Barbaric";
    bytes32[] private namePrefixes = [
        NAME_PREFIX_1,
        NAME_PREFIX_2,
        NAME_PREFIX_3,
        NAME_PREFIX_4,
        NAME_PREFIX_5,
        NAME_PREFIX_6,
        NAME_PREFIX_7,
        NAME_PREFIX_8,
        NAME_PREFIX_9,
        NAME_PREFIX_10,
        NAME_PREFIX_11,
        NAME_PREFIX_12,
        NAME_PREFIX_13,
        NAME_PREFIX_14,
        NAME_PREFIX_15,
        NAME_PREFIX_16,
        NAME_PREFIX_17,
        NAME_PREFIX_18,
        NAME_PREFIX_19,
        NAME_PREFIX_20,
        NAME_PREFIX_21,
        NAME_PREFIX_22,
        NAME_PREFIX_23,
        NAME_PREFIX_24,
        NAME_PREFIX_25,
        NAME_PREFIX_26,
        NAME_PREFIX_27,
        NAME_PREFIX_28,
        NAME_PREFIX_29,
        NAME_PREFIX_30,
        NAME_PREFIX_31,
        NAME_PREFIX_32,
        NAME_PREFIX_33,
        NAME_PREFIX_34,
        NAME_PREFIX_35,
        NAME_PREFIX_36,
        NAME_PREFIX_37,
        NAME_PREFIX_38,
        NAME_PREFIX_39,
        NAME_PREFIX_40,
        NAME_PREFIX_41
    ];
    bytes32 private NAME_SUFFIX_1 = "Grasp";
    bytes32 private NAME_SUFFIX_2 = "Whisper";
    bytes32 private NAME_SUFFIX_3 = "Shadow";
    bytes32 private NAME_SUFFIX_4 = "Torment";
    bytes32 private NAME_SUFFIX_5 = "Will";
    bytes32 private NAME_SUFFIX_6 = "Tears";
    bytes32 private NAME_SUFFIX_7 = "Calling";
    bytes32 private NAME_SUFFIX_8 = "Sun";
    bytes32 private NAME_SUFFIX_9 = "Moon";
    bytes32 private NAME_SUFFIX_10 = "Despair";
    bytes32 private NAME_SUFFIX_11 = "Song";
    bytes32 private NAME_SUFFIX_12 = "Pursuit";
    bytes32 private NAME_SUFFIX_13 = "Rage";
    bytes32 private NAME_SUFFIX_14 = "Lullaby";
    bytes32 private NAME_SUFFIX_15 = "Dream";
    bytes32 private NAME_SUFFIX_16 = "Kiss";
    bytes32 private NAME_SUFFIX_17 = "Lust";
    bytes32 private NAME_SUFFIX_18 = "Beacon";
    bytes32 private NAME_SUFFIX_19 = "Binder";
    bytes32 private NAME_SUFFIX_20 = "Remorse";
    bytes32 private NAME_SUFFIX_21 = "Delusion";
    bytes32[] private nameSuffixes = [
        NAME_SUFFIX_1,
        NAME_SUFFIX_2,
        NAME_SUFFIX_3,
        NAME_SUFFIX_4,
        NAME_SUFFIX_5,
        NAME_SUFFIX_6,
        NAME_SUFFIX_7,
        NAME_SUFFIX_8,
        NAME_SUFFIX_9,
        NAME_SUFFIX_10,
        NAME_SUFFIX_11,
        NAME_SUFFIX_12,
        NAME_SUFFIX_13,
        NAME_SUFFIX_14,
        NAME_SUFFIX_15,
        NAME_SUFFIX_16,
        NAME_SUFFIX_17,
        NAME_SUFFIX_18,
        NAME_SUFFIX_19,
        NAME_SUFFIX_20,
        NAME_SUFFIX_21
    ];

    bytes32 private SVG_PART_1 = '</text><text x="10" y="';
    bytes32 private SVG_PART_2 = ' class="base">';
    bytes32 private SVG_PART_3 = "</text></svg>";

    bytes32 private OUTPUT_START_STRING = '{"name": "Gear # ';
    bytes32 private JSON_STRING = "data:application/json;base64,";
    bytes32 private BRACES = '"}';
    bytes32 private SPACE = " ";
    bytes32 private END_QUOTES = '"';
    bytes32 private COMMA_START_QUOTES = ', "';
    bytes32 private PLUS_ONE = " +1";

    function random(string memory seed, uint256 offset)
        internal
        pure
        returns (uint256)
    {
        return
            uint8(uint256(keccak256(abi.encodePacked(seed, toString(offset)))));
    }

    // Gaussian generation with thanks to @syntro from site:
    // https://www.gaussianprotocol.io/
    // Twitter:
    // https://twitter.com/GaussianProto
    // Contract:
    // https://etherscan.io/address/0xdD301BB7734d0e269A614766c00509df735B254c

    function getRandomGaussianNumbers(string memory seed)
        public
        pure
        returns (uint256[8] memory)
    {
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

    function pluck(
        uint256 tokenId,
        bytes32 keyPrefix,
        uint256 greatness
    ) internal view returns (string memory) {
        bytes32[] memory sourceArray = lookups[keyPrefix];
        uint256 rand = random(string(abi.encodePacked(keyPrefix)), tokenId);
        string memory output = string(
            abi.encodePacked(sourceArray[rand % sourceArray.length])
        );
        if (keyPrefix == HAND_CATEGORY) {
            output = string(abi.encodePacked(output, SPACE, HANDS_SUFFIX));
        }
        if (keyPrefix == RINGS_CATEGORY) {
            output = string(abi.encodePacked(output, SPACE, RING_SUFFIX));
        }
        //In this case, only return where max greatness
        if (keyPrefix == TITLE_CATEGORY) {
            if (greatness > 15) {
                return string(abi.encodePacked(KONOE_SHIDAN));
            } else {
                return "";
            }
        } else {
            if (greatness > 11 || greatness < 9) {
                //For weapons, add a prefix as well to the item
                if (
                    keyPrefix == PRIMARY_WEAPON_CATEGORY ||
                    keyPrefix == SECONDARY_WEAPON_CATEGORY
                ) {
                    output = string(
                        abi.encodePacked(
                            prefixes[rand % prefixes.length],
                            SPACE,
                            output
                        )
                    );
                }
                if (greatness > 12 || greatness < 8) {
                    output = string(
                        abi.encodePacked(
                            output,
                            SPACE,
                            suffixes[rand % suffixes.length]
                        )
                    );
                }
                if (greatness > 13 || greatness < 7) {
                    bytes32[2] memory name;
                    name[0] = namePrefixes[rand % namePrefixes.length];
                    name[1] = nameSuffixes[rand % nameSuffixes.length];
                    if (greatness > 14 || greatness < 6) {
                        output = string(abi.encodePacked(output, PLUS_ONE));
                    }
                    output = string(
                        abi.encodePacked(
                            output,
                            COMMA_START_QUOTES,
                            name[0],
                            SPACE,
                            name[1],
                            END_QUOTES
                        )
                    );
                }
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
        string memory stringTokenId = string(abi.encodePacked(tokenId));
        // console.log("string token id = ", tokenId);
        uint256[8] memory greatnessArray = getRandomGaussianNumbers(
            stringTokenId
        );
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
                    SVG_PART_1,
                    toString((position + 2) * 20),
                    SVG_PART_2
                )
            );
        }

        parts[15] = string(abi.encodePacked(SVG_PART_3));

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
                        OUTPUT_START_STRING,
                        toString(tokenId),
                        '", "description": "0N1 Gear is a derivative of Loot for 0N1 Force with randomized gear generated and stored on chain.", "image": "data:image/svg+xml;base64,',
                        Base64.encode(bytes(output)),
                        BRACES
                    )
                )
            )
        );
        output = string(abi.encodePacked(JSON_STRING, json));
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

    function isGearClaimed(uint256 tokenId)
        external
        view
        returns (bool isClaimed)
    {
        return _claimedList[tokenId];
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
        lookups[categories[0]] = [
            M_WEAPON_1,
            M_WEAPON_2,
            M_WEAPON_3,
            M_WEAPON_4,
            M_WEAPON_5,
            M_WEAPON_6,
            P_WEAPON_1,
            P_WEAPON_2,
            P_WEAPON_3,
            P_WEAPON_4,
            P_WEAPON_5,
            P_WEAPON_6
        ];
        lookups[categories[1]] = [
            S_WEAPON_1,
            S_WEAPON_2,
            S_WEAPON_3,
            S_WEAPON_4,
            S_WEAPON_5,
            S_WEAPON_6,
            M_WEAPON_1,
            M_WEAPON_2,
            M_WEAPON_3,
            M_WEAPON_4,
            M_WEAPON_5,
            M_WEAPON_6
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
            HANDS_8
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
