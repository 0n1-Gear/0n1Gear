import { Contract, Signer } from 'ethers'
import { expect } from 'chai'
import { ethers } from 'hardhat'

let testContext: {
  token: Contract
  owner: Signer
  notOwner: Signer
}

const NAME = '0N1Gear'
const SYMBOL = '0N1Gear'
const PURCHASE_LIMIT = 7

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
    beforeEach(async () => {
      const { token } = testContext

      await token.setIsActive(true)
    })

    it('Test presence of traits from tokenURI', async () => {
      const { token } = testContext
      let i = 1;
      // while (i < 1000) {
      //   console.log('checking ID - ',i);
      //   const result = await token.tokenURI(i);
      //   const base64decoded = Buffer.from(result.split(',')[1], 'base64').toString().trim();
      //   const base64Image = base64decoded.split('base64,')[1]
      //   const svg = Buffer.from(base64Image.split('"')[0], 'base64').toString();
      //   if(svg.split('Kinoe').length-1 === 1){
      //       console.log('found Kinoe Shidan dagger at ',i, svg);
      //       break;
      //   }
      //   // if(svg.split('Katana').length-1 === 2){
      //   //     console.log('found double dagger at ',i, svg);
      //   // }
      //   i++;
      }
    })
  })
})
