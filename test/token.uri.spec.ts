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

    it('Should allow owner to withdraw contract funds', async () => {
      const { token } = testContext
      const price = await token.PRICE_ONI()

      const result = await token.tokenURI(1);
      console.log(result);
    })
  })
})
