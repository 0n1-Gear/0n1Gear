import { BigNumber, Contract, Signer } from 'ethers'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import { base64, keccak256, defaultAbiCoder, ParamType, solidityKeccak256 } from 'ethers/lib/utils'

let testContext: {
  token: Contract
  owner: Signer
  notOwner: Signer
}

const NAME = '0N1Gear'
const SYMBOL = '0N1Gear'
const PURCHASE_LIMIT = 7

const PREFIXES_1 = 'Ornate'
const PREFIXES_2 = 'Bloodied'
const PREFIXES_3 = 'Galvanized'
const PREFIXES_4 = 'Ancient'
const PREFIXES_5 = 'Obsidian'
const PREFIXES_6 = 'Haunted'
const PREFIXES_7 = 'Ethereal'
const PREFIXES_8 = 'Enchanted'
const PREFIXES_9 = 'Infernal'
const PREFIXES_10 = 'Celestial'
const PREFIXES_11 = 'Cursed'

const prefixes = [
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
  PREFIXES_11,
]

const SUFFIXES_1 = 'of Style'
const SUFFIXES_2 = 'of Spirit'
const SUFFIXES_3 = 'of Strength'
const SUFFIXES_4 = 'of Hope'
const SUFFIXES_5 = 'of Skill'
const SUFFIXES_6 = 'of Fury'
const SUFFIXES_7 = 'of Lost Memories'
const SUFFIXES_8 = 'of the Ebony Door'
const SUFFIXES_9 = 'of the Fallen'
const SUFFIXES_10 = 'of the Favoured'
const SUFFIXES_11 = 'of the Supreme'
const SUFFIXES_12 = 'of the Kami'
const SUFFIXES_13 = 'of the Siblings'
const SUFFIXES_14 = 'of the Emperor'

const suffixes = [
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
  SUFFIXES_14,
]
const NAME_PREFIX_1 = "J3ST3R's"
const NAME_PREFIX_2 = "WR1T3R's"
const NAME_PREFIX_3 = "M33Kasa's"
const NAME_PREFIX_4 = "C4N4RY's"
const NAME_PREFIX_5 = "R0S3's"
const NAME_PREFIX_6 = "D34TH's"
const NAME_PREFIX_7 = 'One Source'
const NAME_PREFIX_8 = 'Nameless'
const NAME_PREFIX_9 = 'Illusive'
const NAME_PREFIX_10 = 'Awakened'
const NAME_PREFIX_11 = 'Forgotten'
const NAME_PREFIX_12 = 'Damned'
const NAME_PREFIX_13 = 'Dawn'
const NAME_PREFIX_14 = 'Dusk'
const NAME_PREFIX_15 = 'Fate'
const NAME_PREFIX_16 = 'Howling'
const NAME_PREFIX_17 = 'Brutal'
const NAME_PREFIX_18 = 'Corporeal'
const NAME_PREFIX_19 = 'Peace'
const NAME_PREFIX_20 = 'Chaos'
const NAME_PREFIX_21 = 'Thunder'
const NAME_PREFIX_22 = 'Phantom'
const NAME_PREFIX_23 = 'Oath'
const NAME_PREFIX_24 = 'Luminous'
const NAME_PREFIX_25 = 'Iridescent'
const NAME_PREFIX_26 = 'Forsaken'
const NAME_PREFIX_27 = 'Glory'
const NAME_PREFIX_28 = 'Plague'
const NAME_PREFIX_29 = 'Rebellious'
const NAME_PREFIX_30 = 'Ceaseless'
const NAME_PREFIX_31 = 'Dishonored'
const NAME_PREFIX_32 = 'Silent'
const NAME_PREFIX_34 = 'Bound'
const NAME_PREFIX_35 = 'Divine'
const NAME_PREFIX_36 = 'Eerie'
const NAME_PREFIX_37 = 'Limitless'
const NAME_PREFIX_38 = 'Quantum'
const NAME_PREFIX_39 = 'Living'
const NAME_PREFIX_40 = 'Bestial'
const NAME_PREFIX_41 = 'Barbaric'
const namePrefixes = [
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
  NAME_PREFIX_41,
]
const NAME_SUFFIX_1 = 'Grasp'
const NAME_SUFFIX_2 = 'Whisper'
const NAME_SUFFIX_3 = 'Shadow'
const NAME_SUFFIX_4 = 'Torment'
const NAME_SUFFIX_5 = 'Will'
const NAME_SUFFIX_6 = 'Tears'
const NAME_SUFFIX_7 = 'Calling'
const NAME_SUFFIX_8 = 'Sun'
const NAME_SUFFIX_9 = 'Moon'
const NAME_SUFFIX_10 = 'Despair'
const NAME_SUFFIX_11 = 'Song'
const NAME_SUFFIX_12 = 'Pursuit'
const NAME_SUFFIX_13 = 'Rage'
const NAME_SUFFIX_14 = 'Lullaby'
const NAME_SUFFIX_15 = 'Dream'
const NAME_SUFFIX_16 = 'Kiss'
const NAME_SUFFIX_17 = 'Lust'
const NAME_SUFFIX_18 = 'Beacon'
const NAME_SUFFIX_19 = 'Binder'
const NAME_SUFFIX_20 = 'Remorse'
const NAME_SUFFIX_21 = 'Delusion'
const nameSuffixes = [
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
  NAME_SUFFIX_21,
]

const M_WEAPON_1 = 'Katana'
const M_WEAPON_2 = 'Kukri'
const M_WEAPON_3 = 'Dagger'
const M_WEAPON_4 = 'Neo Sai'
const M_WEAPON_5 = 'Axe'

const P_WEAPON_1 = 'Naginata'
const P_WEAPON_2 = 'Compound Bow'
const P_WEAPON_3 = 'Energy Bolt'
const P_WEAPON_4 = 'Kanabo'
const P_WEAPON_5 = 'Railgun'
const P_WEAPON_6 = 'Odachi'
const P_WEAPON_7 = 'Tactical Staff'

const S_WEAPON_1 = 'Suriken'
const S_WEAPON_2 = 'Flame Talisman'
const S_WEAPON_3 = 'Spider Drones'
const S_WEAPON_4 = 'Tanto'
const S_WEAPON_5 = 'Kunai'
const S_WEAPON_6 = 'Nanite Dust'
const S_WEAPON_7 = 'EMP Grenade'

const WAIST_1 = 'Tactical Belt'
const WAIST_2 = 'Leg Harness'
const WAIST_3 = 'Hip Pack'
const WAIST_4 = 'Cyber Belt'
const WAIST_5 = 'Obi'

const HANDS_1 = 'Leather'
const HANDS_2 = 'Surgical'
const HANDS_3 = 'Techno'
const HANDS_4 = 'Silk'
const HANDS_5 = 'Spiked'
const HANDS_6 = 'Mech'
const HANDS_7 = 'Knuckled'
const HANDS_8 = 'Hardened'

const FEET_1 = 'Rocker Boots'
const FEET_2 = 'Formal Shoes'
const FEET_3 = 'Techno Boots'
const FEET_4 = 'Jika-tabi'
const FEET_5 = 'Grav Sneakers'
const FEET_6 = '0N1 Force Ones'

const RING_1 = 'Ao'
const RING_2 = 'Aka'
const RING_3 = 'Kiiro'

const RINGS = [RING_1, RING_2, RING_3]
const FEET = [FEET_1, FEET_2, FEET_3, FEET_4, FEET_5, FEET_6]
const HANDS = [HANDS_1, HANDS_2, HANDS_3, HANDS_4, HANDS_5, HANDS_6, HANDS_7, HANDS_8]
const SECONDARY = [
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
]
const PRIMARY = [
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
]
const WAIST = [WAIST_1, WAIST_2, WAIST_3, WAIST_4, WAIST_5]
const PRIMARY_WEAPON_CATEGORY = 'PRIMARY WEAPON'
const SECONDARY_WEAPON_CATEGORY = 'SECONDARY WEAPON'
const WAIST_CATEGORY = 'WAIST'
const HAND_CATEGORY = 'HAND'
const FEET_CATEGORY = 'FEET'
const RINGS_CATEGORY = 'RINGS'
const TITLE_CATEGORY = 'TITLE'
const categories: string[] = [
  PRIMARY_WEAPON_CATEGORY,
  SECONDARY_WEAPON_CATEGORY,
  WAIST_CATEGORY,
  HAND_CATEGORY,
  FEET_CATEGORY,
  RINGS_CATEGORY,
  TITLE_CATEGORY,
]

const lookups = new Map<string, string>()
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
  P_WEAPON_7,
]
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
  M_WEAPON_4,
]
const MAX = 7777;
lookups[categories[2]] = [WAIST_1, WAIST_2, WAIST_3, WAIST_4, WAIST_5]
lookups[categories[3]] = [HANDS_1, HANDS_2, HANDS_3, HANDS_4, HANDS_5, HANDS_6, HANDS_7, HANDS_8]
lookups[categories[4]] = [FEET_1, FEET_2, FEET_3, FEET_4, FEET_5, FEET_6]
const HANDS_SUFFIX = 'Gloves'
const RING_SUFFIX = 'Ring'
lookups[categories[5]] = [RING_1, RING_2, RING_3]
lookups[categories[6]] = ['Konoe Shidan']
const max64BitNumber = BigNumber.from(2).pow(8).sub(1)
const random = function (seed: string, offset: number): string {
  return solidityKeccak256(['string', 'string'], [seed, offset.toString()])
}
function getRandomGaussianNumbers(seed: number): number[] {
  const numbers: number[] = []
  for (let i = 0; i < 8; ++i) {
    let accumulator = BigNumber.from(0)
    for (let j = 0; j < 16; ++j) {
      let offset = i * 16 + j
      const accumulatorValue = BigNumber.from(random(seed.toString(), offset)).and(max64BitNumber)
      accumulator = accumulator.add(accumulatorValue)
    }

    accumulator = accumulator.mul(BigNumber.from(10000))
    accumulator = accumulator.div(16)
    accumulator = accumulator.sub(1270000)
    accumulator = accumulator.mul(10000)
    accumulator = accumulator.div(733235)
    accumulator = accumulator.mul(8)
    accumulator = accumulator.add(105000)
    accumulator = accumulator.div(10000)
    numbers[i] = accumulator.toNumber()
  }
  return numbers
}
function pluck(tokenId: number, keyPrefix: string, greatness: number): string {
  const sourceArray = lookups[keyPrefix];
  const rand = BigNumber.from(random(keyPrefix, tokenId)).and(max64BitNumber).toNumber();
  let output = sourceArray[rand % sourceArray.length]
  if (keyPrefix === HAND_CATEGORY) {
    output = output + ' ' + HANDS_SUFFIX
  }
  if (keyPrefix === RINGS_CATEGORY) {
    output = output + ' ' + RING_SUFFIX
  }
  //In this case, only return where max greatness
  if (keyPrefix === TITLE_CATEGORY) {
    if (greatness < 6) {
      return 'Konoe Shidan'
    } else {
      return ''
    }
  } else {
    if (greatness > 11 || greatness < 9) {
      //For weapons, add a prefix as well to the item
      if (keyPrefix === PRIMARY_WEAPON_CATEGORY || keyPrefix === SECONDARY_WEAPON_CATEGORY) {
        output = prefixes[rand % prefixes.length] + ' ' + output
      }
      if (greatness > 12 || greatness < 8) {
        output = output + ' ' + suffixes[rand % suffixes.length]
      }
      if (greatness > 13 || greatness < 7) {
        const name1 = namePrefixes[rand % namePrefixes.length]
        const name2 = nameSuffixes[rand % nameSuffixes.length]
        if (greatness > 14 || greatness < 6) {
          output = output + ' +1'
        }
        output = output + ', "' + name1 + ' ' + name2 + '"'
      }
    }
    return output
  }
}
const encode = (str: string): string => Buffer.from(str, 'binary').toString('base64')
function tokenURI(tokenId: number): string {
  const greatnessArray = getRandomGaussianNumbers(tokenId)
  // console.log('greatness local = ', greatnessArray[6], 'tokenId = ', tokenId)
  if (greatnessArray[6] < 6) {
  }
  let color
  if (greatnessArray[6] < 6) {
    color = 'F35A54'
  } else {
    color = 'FFFFFF'
  }
  let output: string =
    '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base{fill:#fff;font-family:serif;font-size:14px}</style><rect width="100%" height="100%"/><svg x="150" y="20" width="50" height="50" viewBox="0 0 46 45" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)" fill="#'
   + color +
    '"><path fill-rule="evenodd" clip-rule="evenodd" d="M40.99 22.199c0 9.499-7.876 17.2-17.591 17.2s-17.59-7.701-17.59-17.2c0-9.5 7.875-17.2 17.59-17.2s17.59 7.7 17.59 17.2Zm-20.43-6.985v-2.76l-2.83-.006v2.766h-1.424v13.93h14.256v-13.93h-1.444v-2.75l-2.819-.016v2.766h-5.74Zm-1.41 11.194h8.538V18H19.15v8.408Zm5.364-7.23-4.145 4.053 1.978 1.935 4.145-4.053-1.978-1.934Z"/><path d="M23.404.201a22.868 22.868 0 0 0-12.503 3.706 22.117 22.117 0 0 0-8.29 9.873 21.549 21.549 0 0 0-1.283 12.713A21.855 21.855 0 0 0 7.485 37.76a22.665 22.665 0 0 0 11.522 6.023c4.365.85 8.89.414 13.002-1.251a22.4 22.4 0 0 0 10.1-8.104A21.656 21.656 0 0 0 45.9 22.204c0-5.835-2.37-11.43-6.589-15.557C35.094 2.521 29.372.203 23.404.201Zm.056 41.544a20.486 20.486 0 0 1-11.2-3.322 19.813 19.813 0 0 1-7.424-8.846A19.305 19.305 0 0 1 3.689 18.19 19.58 19.58 0 0 1 9.206 8.096a20.305 20.305 0 0 1 10.321-5.394c3.91-.76 7.964-.37 11.648 1.122a20.068 20.068 0 0 1 9.047 7.26 19.4 19.4 0 0 1 3.397 10.95c0 2.588-.521 5.152-1.535 7.543a19.686 19.686 0 0 1-4.37 6.395 20.195 20.195 0 0 1-6.54 4.273c-2.445.99-5.066 1.5-7.714 1.5Z"/></g><defs><clipPath id="clip0"><path fill="#'
 + color +
    '" transform="translate(.901 .201)" d="M0 0h45v44H0z"/></clipPath></defs></svg><text x="10" y="100" class="base">'

  for (let i = 0; i < 7; i++) {
    output += pluck(tokenId, categories[i], greatnessArray[i])
    output += '</text><text x="10" y="' + (100 + (i + 1) * 30) + '" class="base">'
  }

  output += '</text></svg>'
return output;
  // const json = encode(
  //   '{"name": "Gear # ' +
  //     tokenId +
  //     '", "description": "0N1 Gear is a derivative of Loot for 0N1 Force with randomized gear generated and stored on chain.", "image": "data:image/svg+xml;base64,' +
  //     encode(output) +
  //     '"}',
  // )
  // let finalOutput = 'data:application/json;base64,' + json
  // return finalOutput
}
const calcualtePercentage = (obj:any) => {
  Object.keys(obj).forEach(key => {
  if (typeof obj[key] === 'object') {
    calcualtePercentage(obj[key])
      }
      else{
        obj[key] = ((obj[key] / MAX) * 100).toFixed(2) + '%'
      }
  })
}
describe('Check URI', () => {
  beforeEach(async () => {
    const Token = await ethers.getContractFactory('OniGear')
    const token = await Token.deploy(NAME, SYMBOL)
    const [owner, notOwner] = await ethers.getSigners()

    testContext = {
      token,
      owner,
      notOwner,
    }
  })

  describe('Happy path', () => {
    // beforeEach(async () => {
    //   const { token } = testContext

    //   await token.setIsActive(true)
    // })

    it('Test presence of traits from tokenURI', async () => {
      // const { token } = testContext
      let i = 1
      let y = 0
      let results = {
        prefixes: {},
        suffixes: {},
        name_prefixes: {},
        name_suffixes: {},
        primary: {},
        secondary: {},
        doubles:{},
        waist: {},
        hands: {},
        feet: {},
        ring: {},
        konoe: 0,
      }
      while (i < MAX) {
        // console.log('checking ID - ',i);
        // const resultContract = await token.tokenURI(i)
        const svg = tokenURI(i)
        // console.log('output matches local = ', resultContract === resultLocal, resultContract,resultLocal)
        // const base64decoded = Buffer.from(resultContract.split(',')[1], 'base64').toString().trim()
        // const base64Image = base64decoded.split('base64,')[1]
        // const svg = Buffer.from(base64Image.split('"')[0], 'base64').toString()
        if (svg.split('Konoe').length - 1 === 1) {
          results.konoe++
        }
        prefixes.forEach((prefix) => {
          if (svg.split(prefix).length - 1 === 1) {
            if (!results.prefixes[prefix]) {
              results.prefixes[prefix] = 0
            }
            results.prefixes[prefix]++
          }
        })
        suffixes.forEach((suffix) => {
          if (svg.split(suffix).length - 1 === 1) {
            if (!results.suffixes[suffix]) {
              results.suffixes[suffix] = 0
            }
            results.suffixes[suffix]++
          }
        })
        nameSuffixes.forEach((suffix) => {
          if (svg.split(suffix).length - 1 === 1) {
            if (!results.name_suffixes[suffix]) {
              results.name_suffixes[suffix] = 0
            }
            results.name_suffixes[suffix]++
          }
        })
        namePrefixes.forEach((prefix) => {
          if (svg.split(prefix).length - 1 === 1) {
            if (!results.name_prefixes[prefix]) {
              results.name_prefixes[prefix] = 0
            }
            results.name_prefixes[prefix]++
          }
        })
        PRIMARY.forEach((item) => {
          const occurances = svg.split(item).length -1;
          if (occurances === 1) {
            if (!results.primary[item]) {
              results.primary[item] = 0
            }
            results.primary[item]++
          }
          if (occurances === 2) {
            if (!results.doubles[item]) {
              results.doubles[item] = 0
            }
            results.doubles[item]++
          }
        })
        SECONDARY.forEach((item) => {
          const occurances = svg.split(item).length -1;
          if (occurances === 1) {
            if (!results.secondary[item]) {
              results.secondary[item] = 0
            }
            results.secondary[item]++
          }
        })
        WAIST.forEach((item) => {
          if (svg.split(item).length - 1 === 1) {
            if (!results.waist[item]) {
              results.waist[item] = 0
            }
            results.waist[item]++
          }
        })
        HANDS.forEach((item) => {
          if (svg.split(item).length - 1 === 1) {
            if (!results.hands[item]) {
              results.hands[item] = 0
            }
            results.hands[item]++
          }
        })
        FEET.forEach((item) => {
          if (svg.split(item).length - 1 === 1) {
            if (!results.feet[item]) {
              results.feet[item] = 0
            }
            results.feet[item]++
          }
        })
        RINGS.forEach((item) => {
          if (svg.split(item).length - 1 === 1) {
            if (!results.ring[item]) {
              results.ring[item] = 0
            }
            results.ring[item]++
          }
        })
        i++
      }
      console.log(results)
      const resultsCopy = Object.assign({},results);
      calcualtePercentage(resultsCopy);
      console.log(resultsCopy)
    })
  })
})
