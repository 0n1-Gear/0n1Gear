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

describe('Purchase tokens', () => {
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
      const price = await token.PRICE_PUBLIC()

      expect(await ethers.provider.getBalance(token.address)).to.be.equal(0)

      await token.purchase(PURCHASE_LIMIT, { value: price.mul(PURCHASE_LIMIT) })

      expect(await ethers.provider.getBalance(token.address)).to.be.equal(price.mul(PURCHASE_LIMIT))

      await token.purchase(PURCHASE_LIMIT, { value: price.mul(PURCHASE_LIMIT) })

      expect(await ethers.provider.getBalance(token.address)).to.be.equal(price.mul(PURCHASE_LIMIT).mul(2))

      await token.withdraw()

      expect(await ethers.provider.getBalance(token.address)).to.be.equal(0)
    })
  })

  describe('Unhappy path', () => {
    beforeEach(async () => {
      const { token } = testContext

      await token.setIsActive(true)
    })

    it('Should not allow others to withdraw funds', async () => {
      const { token, notOwner } = testContext
      const price = await token.PRICE_PUBLIC()

      expect(await ethers.provider.getBalance(token.address)).to.be.equal(0)

      await token.purchase(PURCHASE_LIMIT, { value: price.mul(PURCHASE_LIMIT) })

      expect(await ethers.provider.getBalance(token.address)).to.be.equal(price.mul(PURCHASE_LIMIT))

      await token.purchase(PURCHASE_LIMIT, { value: price.mul(PURCHASE_LIMIT) })

      expect(await ethers.provider.getBalance(token.address)).to.be.equal(price.mul(PURCHASE_LIMIT).mul(2))

      await expect(token.connect(notOwner).withdraw()).to.be.revertedWith('Ownable: caller is not the owner')

      expect(await ethers.provider.getBalance(token.address)).to.be.equal(price.mul(PURCHASE_LIMIT).mul(2))
    })
  })
})
