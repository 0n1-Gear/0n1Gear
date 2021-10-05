import { BigNumber,  Contract, Signer } from 'ethers'
import { ethers } from 'hardhat'

import { assert, expect } from "chai";

const NAME = 'OniGear'
const SYMBOL = '0N1'
const GEAR_MAX = 7_777
const PURCHASE_LIMIT = 7
const PRICE_ONI = BigNumber.from('25000000000000000')
const PRICE_PUBLIC = BigNumber.from('50000000000000000')
const activated = false
const isAllowListActive = false
const proof = ''
const totalGiftSupply = 0
const totalPublicSupply = 0

const DEPLOY_VALUES: [string, string | number | BigNumber | boolean][] = [
  ['name', NAME],
  ['symbol', SYMBOL],
  ['GEAR_MAX', GEAR_MAX],
  ['PURCHASE_LIMIT', PURCHASE_LIMIT],
  ['PRICE_ONI', PRICE_ONI],
  ['PRICE_PUBLIC', PRICE_PUBLIC],
  ['activated', activated],
  ['isAllowListActive', isAllowListActive],
]
let testContext: {
  token: Contract
  owner: Signer
  notOwner: Signer
}

describe('Deploy token', () => {
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
      DEPLOY_VALUES.forEach(([method, value]) => {
        it(`Should get value for ${method}`, async () => {
          const { token } = testContext

          expect(await token[method]()).to.equal(value)
        })
      })

      it('Should have owner', async () => {
        const { token, owner } = testContext
        const ownerAddr = await owner.getAddress()

        expect(await token.owner()).to.equal(ownerAddr)
      })
    })
  })
//   describe("Check outputs", async () => {
//     it("Look for double daggers", async () => {
//       let i = 1;
//       const result = await contract.tokenURI(i);
//       while (i < 1000) {
//         const result = await contract.tokenURI(i);
//         const base64decoded = Buffer.from(result.split(',')[1], 'base64').toString().trim();
//         const base64Image = base64decoded.split('base64,')[1]
//         const svg = Buffer.from(base64Image.split('"')[0], 'base64').toString();
//         if(svg.split('Kinoe').length-1 === 1){
//             console.log('found Kinoe Shidan dagger at ',i, svg);
//         }
//         // if(svg.split('Katana').length-1 === 2){
//         //     console.log('found double dagger at ',i, svg);
//         // }
//         i++;
//       }
//     });
//   });
