import { Contract, Signer } from 'ethers'
import { expect } from 'chai'
import { ethers } from 'hardhat'

let testContext: {
  token: Contract
  owner: Signer
  notOwner: Signer
  notOwner2: Signer
}

const NAME = '0N1 Gear'
const SYMBOL = '0N1GEAR'

describe('Setup allow list', () => {
  beforeEach(async () => {
    const Token = await ethers.getContractFactory('OniGear')
    const token = await Token.deploy(NAME, SYMBOL)
    const [owner, notOwner, notOwner2] = await ethers.getSigners()

    testContext = {
      token,
      owner,
      notOwner,
      notOwner2,
    }

    await token.setIsActive(true)
    await token.setIsAllowListActive(false)
  })

  describe('Happy path', () => {
    it('Should allow owner to claim single Oni (single)', async () => {
      const { token, notOwner } = testContext

      const price = await token.PRICE_PUBLIC()

      const notOwnerAddress = await notOwner.getAddress()

      expect(await token.balanceOf(notOwnerAddress)).to.be.equal(0)

      await token.connect(notOwner).purchase(1, { value: price })

      expect(await token.balanceOf(notOwnerAddress)).to.be.equal(1)

      expect(await token.ownerOf(1)).to.be.equal(notOwnerAddress)

    })

    it('Should allow owner to claim single Oni (multiple)', async () => {
      const { token, notOwner } = testContext

      const price = await token.PRICE_PUBLIC()

      const notOwnerAddress = await notOwner.getAddress()

      expect(await token.balanceOf(notOwnerAddress)).to.be.equal(0)

      let i=3;
      while (i--){
        await token.connect(notOwner).purchase(1, { value: price })
      }

      expect(await token.balanceOf(notOwnerAddress)).to.be.equal(3)
    })

    it('Should allow owner to claim multple Onis ', async () => {
      const { token, notOwner } = testContext

      const price = await token.PRICE_PUBLIC()

      const notOwnerAddress = await notOwner.getAddress()

      expect(await token.balanceOf(notOwnerAddress)).to.be.equal(0)

      await token.connect(notOwner).purchase(3, { value: price.mul(3) })

      expect(await token.balanceOf(notOwnerAddress)).to.be.equal(3)

    })

  })

  describe('Unhappy path', () => {
    it('Should not allow minting during contract inactive', async () => {
      const { token, notOwner } = testContext

      token.setIsActive(false);

      const price = await token.PRICE_PUBLIC()

      const notOwnerAddress = await notOwner.getAddress()

      await expect(token.connect(notOwner).purchase(1, { value: price })).to.be.revertedWith('Inactive')
    })
    it('Should not allow minting during reserved phase', async () => {
      const { token, notOwner } = testContext

      token.setIsAllowListActive(true);

      const price = await token.PRICE_PUBLIC()

      const notOwnerAddress = await notOwner.getAddress()

      await expect(token.connect(notOwner).purchase(1, { value: price })).to.be.revertedWith('Allowed Inactive')
    })
    it('Try and mint too many', async () => {
      const { token, notOwner } = testContext

      const price = await token.PRICE_PUBLIC()

      const notOwnerAddress = await notOwner.getAddress()

      expect(await token.balanceOf(notOwnerAddress)).to.be.equal(0)

      await expect(token.connect(notOwner).purchase(8, { value: price.mul(8) })).to.be.revertedWith('Too many')
    })
  })
})
