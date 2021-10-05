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
  // describe("Owner Minting 0n1 Gear", async () => {
  //   it("Try and mint when contract inactive", async () => {
  //     contract.setIsActive(false);
  //     await expectRevert(contract.ownerClaim([7778]), "Contract inactive");
  //   });
  //   it("Set contract to active", async () => {
  //     contract.setIsActive(true);
  //   });
  //   it("Attempt private mint when not owner", async () => {
  //     await expectRevert(
  //       contract.ownerClaim([7778], { from: accounts[8] }),
  //       "Ownable: caller is not the owner"
  //     );
  //   });
  //   it("Attempt private mint ID too low", async () => {
  //     await expectRevert(contract.ownerClaim([7700]), "Token ID invalid");
  //   });
  //   it("Attempt private mint ID too high", async () => {
  //     await expectRevert(contract.ownerClaim([8001]), "Token ID invalid");
  //   });
  //   it("Private mint lowest ID", async () => {
  //     const result = await contract.ownerClaim([7701]);
  //     const event = result.logs[0].args;
  //     assert.equal(event.tokenId.toNumber(), 7701, "id is correct");
  //     assert.equal(
  //       event.from,
  //       "0x0000000000000000000000000000000000000000",
  //       "from is correct"
  //     );
  //     assert.equal(event.to, accounts[0], "to is correct");
  //     const totalSupply = await contract.totalSupply();
  //     assert.equal(totalSupply, 17);
  //   });
  //   it("Private mint highest ID", async () => {
  //     const result = await contract.ownerClaim([8000]);
  //     const event = result.logs[0].args;
  //     assert.equal(event.tokenId.toNumber(), 8000, "id is correct");
  //     assert.equal(
  //       event.from,
  //       "0x0000000000000000000000000000000000000000",
  //       "from is correct"
  //     );
  //     assert.equal(event.to, accounts[0], "to is correct");
  //     const totalSupply = await contract.totalSupply();
  //     assert.equal(totalSupply, 18);
  //   });
  //   it("Private mint already minted", async () => {
  //     await expectRevert(contract.ownerClaim([8000]), "Already minted");
  //   });
  //   it("Private mint multiple private IDs", async () => {
  //     const result = await contract.ownerClaim([7702, 7703, 7704, 7705]);
  //     const event = result.logs[0].args;
  //     const event2 = result.logs[1].args;
  //     const event3 = result.logs[2].args;
  //     const event4 = result.logs[3].args;
  //     assert.equal(event.tokenId.toNumber(), 7702, "id is correct");
  //     assert.equal(
  //       event.from,
  //       "0x0000000000000000000000000000000000000000",
  //       "from is correct"
  //     );
  //     assert.equal(event.to, accounts[0], "to is correct");
  //     assert.equal(event2.tokenId.toNumber(), 7703, "id is correct");
  //     assert.equal(
  //       event2.from,
  //       "0x0000000000000000000000000000000000000000",
  //       "from is correct"
  //     );
  //     assert.equal(event2.to, accounts[0], "to is correct");
  //     assert.equal(event3.tokenId.toNumber(), 7704, "id is correct");
  //     assert.equal(
  //       event3.from,
  //       "0x0000000000000000000000000000000000000000",
  //       "from is correct"
  //     );
  //     assert.equal(event3.to, accounts[0], "to is correct");
  //     assert.equal(event4.tokenId.toNumber(), 7705, "id is correct");
  //     assert.equal(
  //       event4.from,
  //       "0x0000000000000000000000000000000000000000",
  //       "from is correct"
  //     );
  //     assert.equal(event4.to, accounts[0], "to is correct");
  //     const totalSupply = await contract.totalSupply();
  //     assert.equal(totalSupply, 22);
  //   });
  //   it("Private mint multiple private IDs with one too low", async () => {
  //     await expectRevert(
  //       contract.ownerClaim([7022, 7706, 7707, 7708]),
  //       "Token ID invalid"
  //     );
  //   });
  //   it("Private mint multiple private IDs with one too high", async () => {
  //     await expectRevert(
  //       contract.ownerClaim([7706, 7707, 7708, 8002]),
  //       "Token ID invalid"
  //     );
  //   });
  // });
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

