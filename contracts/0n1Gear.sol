// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/interfaces/IERC721Enumerable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "base64-sol/base64.sol";

contract OniGear is ERC721URIStorage, ReentrancyGuard, Ownable {
    uint256 public GEAR_MAX = 7_777;
    uint256 public PURCHASE_LIMIT = 7;

    bool public activated;
    bool public isAllowListActive;

    uint256 public PRICE_ONI = 0.025 ether;
    uint256 public PRICE_PUBLIC = 0.05 ether;

    uint256 private _tokenCount;
    mapping(uint256 => bool) private _claimedList;
    mapping(string => string[]) private lookups;

    address private _oniAddress;
    IERC721Enumerable private _oniContract;

    string private PRIMARY_WEAPON_CATEGORY = "PRIMARY WEAPON";
    string private SECONDARY_WEAPON_CATEGORY = "SECONDARY WEAPON";
    string private WAIST_CATEGORY = "WAIST";
    string private HAND_CATEGORY = "HAND";
    string private FEET_CATEGORY = "FEET";
    string private RINGS_CATEGORY = "RINGS";
    string private TITLE_CATEGORY = "TITLE";

    //MIXED PRIMARY OR SECONDARY (OR BOTH) WEAPONS
    string private M_WEAPON_1 = "Katana";
    string private M_WEAPON_2 = "Kukri";
    string private M_WEAPON_3 = "Dagger";
    string private M_WEAPON_4 = "Neo Sai";
    string private M_WEAPON_5 = "Axe";

    //PRIMARY WEAPONS
    string private P_WEAPON_1 = "Naginata";
    string private P_WEAPON_2 = "Compound Bow";
    string private P_WEAPON_3 = "Energy Bolt";
    string private P_WEAPON_4 = "Kanabo";
    string private P_WEAPON_5 = "Railgun";
    string private P_WEAPON_6 = "Odachi";
    string private P_WEAPON_7 = "Tactical Staff";

    //SECONDARY WEAPONS
    string private S_WEAPON_1 = "Shuriken";
    string private S_WEAPON_2 = "Flame Talisman";
    string private S_WEAPON_3 = "Spider Drones";
    string private S_WEAPON_4 = "Tanto";
    string private S_WEAPON_5 = "Kunai";
    string private S_WEAPON_6 = "Nanite Dust";
    string private S_WEAPON_7 = "EMP Grenade";

    //WAIST ITEMS
    string private WAIST_1 = "Tactical Belt";
    string private WAIST_2 = "Leg Harness";
    string private WAIST_3 = "Hip Pack";
    string private WAIST_4 = "Cyber Belt";
    string private WAIST_5 = "Obi";

    //HANDS ITEMS
    string private HANDS_SUFFIX = "Gloves";
    string private HANDS_1 = "Leather";
    string private HANDS_2 = "Surgical";
    string private HANDS_3 = "Techno";
    string private HANDS_4 = "Silk";
    string private HANDS_5 = "Spiked";
    string private HANDS_6 = "Mech";
    string private HANDS_7 = "Knuckled";
    string private HANDS_8 = "Hardened";

    //FEET ITEMS
    string private FEET_1 = "Rocker Boots";
    string private FEET_2 = "Formal Shoes";
    string private FEET_3 = "Techno Boots";
    string private FEET_4 = "Jika-tabi";
    string private FEET_5 = "Grav Sneakers";
    string private FEET_6 = "0N1 Force Ones";

    //RINGS
    string private RING_SUFFIX = "Ring";
    string private RING_1 = "Ao";
    string private RING_2 = "Aka";
    string private RING_3 = "Kiiro";

    //SPECIAL TITLE
    string private KONOE_SHIDAN = "Konoe Shidan";

    string[] private categories = [
        PRIMARY_WEAPON_CATEGORY,
        SECONDARY_WEAPON_CATEGORY,
        WAIST_CATEGORY,
        HAND_CATEGORY,
        FEET_CATEGORY,
        RINGS_CATEGORY,
        TITLE_CATEGORY
    ];

    string private SUFFIXES_1 = "of Style";
    string private SUFFIXES_2 = "of Spirit";
    string private SUFFIXES_3 = "of Strength";
    string private SUFFIXES_4 = "of Hope";
    string private SUFFIXES_5 = "of Skill";
    string private SUFFIXES_6 = "of Fury";
    string private SUFFIXES_7 = "of Lost Memories";
    string private SUFFIXES_8 = "of the Ebony Door";
    string private SUFFIXES_9 = "of the Fallen";
    string private SUFFIXES_10 = "of the Favoured";
    string private SUFFIXES_11 = "of the Supreme";
    string private SUFFIXES_12 = "of the Kami";
    string private SUFFIXES_13 = "of the Siblings";
    string private SUFFIXES_14 = "of the Emperor";

    string[] private suffixes = [
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
    string private PREFIXES_1 = "Ornate";
    string private PREFIXES_2 = "Bloodied";
    string private PREFIXES_3 = "Galvanized";
    string private PREFIXES_4 = "Ancient";
    string private PREFIXES_5 = "Obsidian";
    string private PREFIXES_6 = "Haunted";
    string private PREFIXES_7 = "Ethereal";
    string private PREFIXES_8 = "Enchanted";
    string private PREFIXES_9 = "Infernal";
    string private PREFIXES_10 = "Celestial";
    string private PREFIXES_11 = "Cursed";

    string[] private prefixes = [
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

    string private NAME_PREFIX_1 = "J3ST3R's";
    string private NAME_PREFIX_2 = "WR1T3R's";
    string private NAME_PREFIX_3 = "M33Kasa's";
    string private NAME_PREFIX_4 = "C4N4RY's";
    string private NAME_PREFIX_5 = "R0S3's";
    string private NAME_PREFIX_6 = "D34TH's";
    string private NAME_PREFIX_7 = "One Source";
    string private NAME_PREFIX_8 = "Nameless";
    string private NAME_PREFIX_9 = "Illusive";
    string private NAME_PREFIX_10 = "Awakened";
    string private NAME_PREFIX_11 = "Forgotten";
    string private NAME_PREFIX_12 = "Damned";
    string private NAME_PREFIX_13 = "Dawn";
    string private NAME_PREFIX_14 = "Dusk";
    string private NAME_PREFIX_15 = "Fate";
    string private NAME_PREFIX_16 = "Howling";
    string private NAME_PREFIX_17 = "Brutal";
    string private NAME_PREFIX_18 = "Corporeal";
    string private NAME_PREFIX_19 = "Peace";
    string private NAME_PREFIX_20 = "Chaos";
    string private NAME_PREFIX_21 = "Thunder";
    string private NAME_PREFIX_22 = "Phantom";
    string private NAME_PREFIX_23 = "Oath";
    string private NAME_PREFIX_24 = "Luminous";
    string private NAME_PREFIX_25 = "Iridescent";
    string private NAME_PREFIX_26 = "Forsaken";
    string private NAME_PREFIX_27 = "Glory";
    string private NAME_PREFIX_28 = "Plague";
    string private NAME_PREFIX_29 = "Rebellious";
    string private NAME_PREFIX_30 = "Ceaseless";
    string private NAME_PREFIX_31 = "Dishonored";
    string private NAME_PREFIX_32 = "Silent";
    string private NAME_PREFIX_34 = "Bound";
    string private NAME_PREFIX_35 = "Divine";
    string private NAME_PREFIX_36 = "Eerie";
    string private NAME_PREFIX_37 = "Limitless";
    string private NAME_PREFIX_38 = "Quantum";
    string private NAME_PREFIX_39 = "Living";
    string private NAME_PREFIX_40 = "Bestial";
    string private NAME_PREFIX_41 = "Barbaric";
    string[] private namePrefixes = [
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
        NAME_PREFIX_34,
        NAME_PREFIX_35,
        NAME_PREFIX_36,
        NAME_PREFIX_37,
        NAME_PREFIX_38,
        NAME_PREFIX_39,
        NAME_PREFIX_40,
        NAME_PREFIX_41
    ];
    string private NAME_SUFFIX_1 = "Grasp";
    string private NAME_SUFFIX_2 = "Whisper";
    string private NAME_SUFFIX_3 = "Shadow";
    string private NAME_SUFFIX_4 = "Torment";
    string private NAME_SUFFIX_5 = "Will";
    string private NAME_SUFFIX_6 = "Tears";
    string private NAME_SUFFIX_7 = "Calling";
    string private NAME_SUFFIX_8 = "Sun";
    string private NAME_SUFFIX_9 = "Moon";
    string private NAME_SUFFIX_10 = "Despair";
    string private NAME_SUFFIX_11 = "Song";
    string private NAME_SUFFIX_12 = "Pursuit";
    string private NAME_SUFFIX_13 = "Rage";
    string private NAME_SUFFIX_14 = "Lullaby";
    string private NAME_SUFFIX_15 = "Dream";
    string private NAME_SUFFIX_16 = "Kiss";
    string private NAME_SUFFIX_17 = "Lust";
    string private NAME_SUFFIX_18 = "Beacon";
    string private NAME_SUFFIX_19 = "Binder";
    string private NAME_SUFFIX_20 = "Remorse";
    string private NAME_SUFFIX_21 = "Delusion";
    string[] private nameSuffixes = [
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
        internal
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

    function compareStringsbyBytes(string memory s1, string memory s2)
        public
        pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked((s1))) ==
            keccak256(abi.encodePacked((s2))));
    }

    function pluck(
        uint256 tokenId,
        string memory keyPrefix,
        uint256 greatness
    ) internal view returns (string memory) {
        string[] memory sourceArray = lookups[keyPrefix];
        uint256 rand = random(string(abi.encodePacked(keyPrefix)), tokenId);
        string memory output = sourceArray[rand % sourceArray.length];
        if (compareStringsbyBytes(keyPrefix, HAND_CATEGORY)) {
            output = string(abi.encodePacked(output, " ", HANDS_SUFFIX));
        }
        if (compareStringsbyBytes(keyPrefix, RINGS_CATEGORY)) {
            output = string(abi.encodePacked(output, " ", RING_SUFFIX));
        }
        //In this case, only return where max greatness
        if (compareStringsbyBytes(keyPrefix, TITLE_CATEGORY)) {
            if (greatness < 6) {
                return string(abi.encodePacked(KONOE_SHIDAN));
            } else {
                return "";
            }
        } else {
            if (greatness > 11 || greatness < 9) {
                //For weapons, add a prefix as well to the item
                if (
                    compareStringsbyBytes(keyPrefix, PRIMARY_WEAPON_CATEGORY) ||
                    compareStringsbyBytes(keyPrefix, SECONDARY_WEAPON_CATEGORY)
                ) {
                    output = string(
                        abi.encodePacked(
                            prefixes[rand % prefixes.length],
                            " ",
                            output
                        )
                    );
                }
                if (greatness > 12 || greatness < 8) {
                    output = string(
                        abi.encodePacked(
                            output,
                            " ",
                            suffixes[rand % suffixes.length]
                        )
                    );
                }
                if (greatness > 13 || greatness < 7) {
                    string[2] memory name;
                    name[0] = namePrefixes[rand % namePrefixes.length];
                    name[1] = nameSuffixes[rand % nameSuffixes.length];
                    if (greatness > 14 || greatness < 6) {
                        output = string(abi.encodePacked(output, " +1"));
                    }
                    output = string(
                        abi.encodePacked(
                            output,
                            ', "',
                            name[0],
                            " ",
                            name[1],
                            '"'
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
        uint256[8] memory greatnessArray = getRandomGaussianNumbers(
            toString(tokenId)
        );
        //Optimise the tokenURI process by making a loop and using variables stored in mapping
        string[16] memory parts;
         parts[0] = string(
            abi.encodePacked(
                '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base{fill:#fff;font-family:serif;font-size:14px}</style><rect width="100%" height="100%"/>',
                '<text x="10" y="40" class="base">')
        );
        for (uint256 i = 0; i < 7; i++) {
            uint256 position = i * 2 + 1;
            parts[position] = pluck(tokenId, categories[i], greatnessArray[i]);
            parts[position + 1] = string(
                abi.encodePacked(
                    '</text><text x="10" y="',
                    toString(40 + ((i + 1) * 40)),
                    '" class="base">'
                )
            );
        }

        parts[15] = string(abi.encodePacked("</text></svg>"));

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

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "Gear # ',
                        toString(tokenId),
                        '", "description": "0N1 Gear is a derivative of Loot for 0N1 Force with randomized gear generated and stored on chain.", "image": "data:image/svg+xml;base64,',
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

    function totalSupply() external view returns (uint256 supply) {
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
        require(activated, "Inactive");
        require(!isAllowListActive, "Allowed Inactive");
        require(_tokenCount < GEAR_MAX, "All minted");
        require(_tokenCount + numberOfTokens <= GEAR_MAX, "None Left");
        require(PRICE_PUBLIC * numberOfTokens <= msg.value, "ETH inadequate");
        require(numberOfTokens <= PURCHASE_LIMIT, "Too many");
        for (uint256 i = 0; i < numberOfTokens; i++) {
            uint256 idToMint;
            //Want to start any token IDs at 1, not 0
            for (uint256 j = 1; j < GEAR_MAX + 1; j++) {
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
        public
        view
        returns (uint256[] memory tokenIds)
    {
        uint256 numberOfOnis = _oniContract.balanceOf(owner);
        if(numberOfOnis == 0){
          return new uint256[](0);
        }
        uint256[] memory tokenIdsToReturn = new uint256[](numberOfOnis);
        for (uint256 i = 0; i < numberOfOnis; i++) {
            tokenIdsToReturn[i] = _oniContract.tokenOfOwnerByIndex(owner, i);
        }
        return tokenIdsToReturn;
    }

    function claimAllTokens() external payable {
        require(activated, "Inactive");
        require(isAllowListActive, "Allowed Inactive");
        require(_tokenCount < GEAR_MAX, "All minted");
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
        require(unclaimedOnis > 0, "None to claim");
        require(PRICE_ONI * unclaimedOnis <= msg.value, "ETH inadequate");

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
        require(activated, "Inactive");
        require(isAllowListActive, "Allowed Inactive");
        require(_tokenCount < GEAR_MAX, "All minted");
        require(PRICE_ONI <= msg.value, "ETH inadequate");
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
        require(isOwned, "Not owned");
        _tokenCount++;
        _claimedList[oniId] = true;
        _safeMint(msg.sender, oniId);
    }

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        lookups[categories[0]] = [
            M_WEAPON_1,
            M_WEAPON_2,
            M_WEAPON_3,
            M_WEAPON_4,
            M_WEAPON_5,
            P_WEAPON_1,
            P_WEAPON_2,
            P_WEAPON_3,
            P_WEAPON_4,
            P_WEAPON_5,
            P_WEAPON_6,
            P_WEAPON_7
        ];
        lookups[categories[1]] = [
            S_WEAPON_1,
            S_WEAPON_2,
            S_WEAPON_3,
            S_WEAPON_4,
            S_WEAPON_5,
            S_WEAPON_6,
            S_WEAPON_7,
            M_WEAPON_1,
            M_WEAPON_2,
            M_WEAPON_3,
            M_WEAPON_5,
            M_WEAPON_4
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

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
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
