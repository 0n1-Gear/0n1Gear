import { Contract, Signer } from 'ethers'
import { expect } from 'chai'
import { ethers } from 'hardhat'

let testContext: {
  token: Contract
  mockToken: Contract
  owner: Signer
  notOwner: Signer
  notOwner2: Signer
}

const NAME = '0N1Gear'
const SYMBOL = '0N1Gear'
const MOCK_NAME = '0N1GearMock'
const MOCK_SYMBOL = '0N1GearMock'
const PURCHASE_LIMIT = 7

describe('Setup allow list', () => {
  beforeEach(async () => {
    const Token = await ethers.getContractFactory('OniGear')
    const MockToken = await ethers.getContractFactory('OniMock')
    const token = await Token.deploy(NAME, SYMBOL)
    const mockToken = await MockToken.deploy(MOCK_NAME, MOCK_SYMBOL)
    const [owner, notOwner, notOwner2] = await ethers.getSigners()

    testContext = {
      mockToken,
      token,
      owner,
      notOwner,
      notOwner2,
    }

    await token.setIsActive(true)
    await token.setIsAllowListActive(true)
    await token.setOniContractAddress(mockToken.address)
  })

  describe('Happy path', () => {
    it('Should allow owner to claim all Onis (single)', async () => {
      const { mockToken, token, notOwner } = testContext

      const price = await token.PRICE_ONI()

      const notOwnerAddress = await notOwner.getAddress()

      expect(await token.balanceOf(notOwnerAddress)).to.be.equal(0)

      await expect(token.ownerOf(99)).to.be.revertedWith('ERC721: owner query for nonexistent token')

      await mockToken.setOwnerOnis(notOwnerAddress, ['99'])

      await token.connect(notOwner).claimAllTokens({ value: price })

      expect(await token.balanceOf(notOwnerAddress)).to.be.equal(1)

      expect(await token.ownerOf(99)).to.be.equal(notOwnerAddress)

      await expect(token.connect(notOwner).claimAllTokens({ value: price })).to.be.revertedWith(
        'None to claim',
      )
    })

    it('Should allow owner to claim all Onis (multiple)', async () => {
      const { mockToken, token, notOwner2 } = testContext

      const ONI_ARRAY = [1, 1000, 3000, 5600]

      const price = await token.PRICE_ONI()

      const notOwnerAddress = await notOwner2.getAddress()

      expect(await token.balanceOf(notOwnerAddress)).to.be.equal(0)

      ONI_ARRAY.forEach(async (oni) => {
        await expect(token.ownerOf(oni)).to.be.revertedWith('ERC721: owner query for nonexistent token')
      })

      await mockToken.setOwnerOnis(notOwnerAddress, ONI_ARRAY)

      await token.connect(notOwner2).claimAllTokens({ value: price.mul(ONI_ARRAY.length) })

      expect(await token.balanceOf(notOwnerAddress)).to.be.equal(ONI_ARRAY.length)

      ONI_ARRAY.forEach(async (oni) => {
        expect(await token.ownerOf(oni)).to.be.equal(notOwnerAddress)
      })

      await expect(token.connect(notOwner2).claimAllTokens({ value: price.mul(ONI_ARRAY.length) })).to.be.revertedWith(
        'None to claim',
      )
    })

    it('Should allow owner to claim all Onis (multiple) in separate events', async () => {
      const { mockToken, token, notOwner2 } = testContext

      const ONI_ARRAY = [1, 1000, 3000]

      const price = await token.PRICE_ONI()

      const notOwnerAddress = await notOwner2.getAddress()

      expect(await token.balanceOf(notOwnerAddress)).to.be.equal(0)

      ONI_ARRAY.forEach(async (oni) => {
        await expect(token.ownerOf(oni)).to.be.revertedWith('ERC721: owner query for nonexistent token')
      })

      await mockToken.setOwnerOnis(notOwnerAddress, ONI_ARRAY)

      await token.connect(notOwner2).claimAllTokens({ value: price.mul(ONI_ARRAY.length) })

      expect(await token.balanceOf(notOwnerAddress)).to.be.equal(ONI_ARRAY.length)

      ONI_ARRAY.forEach(async (oni) => {
        expect(await token.ownerOf(oni)).to.be.equal(notOwnerAddress)
      })

      ONI_ARRAY.push(5600)

      await mockToken.setOwnerOnis(notOwnerAddress, ONI_ARRAY)

      await token.connect(notOwner2).claimAllTokens({ value: price })

      expect(await token.balanceOf(notOwnerAddress)).to.be.equal(ONI_ARRAY.length)

      ONI_ARRAY.forEach(async (oni) => {
        expect(await token.ownerOf(oni)).to.be.equal(notOwnerAddress)
      })

      await expect(token.connect(notOwner2).claimAllTokens({ value: price })).to.be.revertedWith(
        'None to claim',
      )
    })

    it("Should allow owner to claim Oni's one at a time (single)", async () => {
      const { mockToken, token, notOwner } = testContext

      const price = await token.PRICE_ONI()

      const notOwnerAddress = await notOwner.getAddress()

      expect(await token.balanceOf(notOwnerAddress)).to.be.equal(0)

      await expect(token.ownerOf(299)).to.be.revertedWith('ERC721: owner query for nonexistent token')

      await mockToken.setOwnerOnis(notOwnerAddress, [299])

      await token.connect(notOwner).claimToken(299, { value: price })

      expect(await token.balanceOf(notOwnerAddress)).to.be.equal(1)

      expect(await token.ownerOf(299)).to.be.equal(notOwnerAddress)

      await expect(token.connect(notOwner).claimAllTokens({ value: price })).to.be.revertedWith(
        'None to claim',
      )
    })

    it("Should allow owner to claim Oni's one at a time (multiple)", async () => {
      const { mockToken, token, notOwner } = testContext

      const ONI_ARRAY = [1, 1000, 3000]

      const price = await token.PRICE_ONI()

      const notOwnerAddress = await notOwner.getAddress()

      expect(await token.balanceOf(notOwnerAddress)).to.be.equal(0)

      ONI_ARRAY.forEach(async (oni) => {
        await expect(token.ownerOf(oni)).to.be.revertedWith('ERC721: owner query for nonexistent token')
      })

      await mockToken.setOwnerOnis(notOwnerAddress, ONI_ARRAY)

      for (let [index, oni] of ONI_ARRAY.entries()) {

        await token.connect(notOwner).claimToken(oni, { value: price })

        expect( await token.balanceOf(notOwnerAddress)).to.be.equal(index + 1)

        expect(await token.ownerOf(oni)).to.be.equal(notOwnerAddress)
      }

      await expect(token.connect(notOwner).claimAllTokens({ value: price.mul((ONI_ARRAY.length)) })).to.be.revertedWith(
        'None to claim',
      )
    })
  })

  describe('Unhappy path', () => {
    it('Should not allow minting all during contract inactive', async () => {
      const { token, notOwner } = testContext

      token.setIsActive(false);

      const price = await token.PRICE_ONI()

      const notOwnerAddress = await notOwner.getAddress()

      await expect(token.connect(notOwner).claimAllTokens({ value: price })).to.be.revertedWith('Inactive')
    })
    it('Should not allow minting all after reserved phase', async () => {
      const { token, notOwner } = testContext

      token.setIsAllowListActive(false);

      const price = await token.PRICE_ONI()

      const notOwnerAddress = await notOwner.getAddress()

      await expect(token.connect(notOwner).claimAllTokens({ value: price })).to.be.revertedWith('Allowed Inactive')
    })
    it('Should not allow minting all during contract inactive', async () => {
      const { token, notOwner } = testContext

      token.setIsActive(false);

      const price = await token.PRICE_ONI()

      const notOwnerAddress = await notOwner.getAddress()

      await expect(token.connect(notOwner).claimToken(100, { value: price })).to.be.revertedWith('Inactive')
    })
    it('Should not allow minting single after reserved phase', async () => {
      const { token, notOwner } = testContext

      token.setIsAllowListActive(false);

      const price = await token.PRICE_ONI()

      const notOwnerAddress = await notOwner.getAddress()

      await expect(token.connect(notOwner).claimToken(100, { value: price })).to.be.revertedWith('Allowed Inactive')
    })
    it('Should not allow others to mint during reserved phase', async () => {
      const { token, notOwner2 } = testContext

      const price = await token.PRICE_ONI()

      const notOwner2Address = await notOwner2.getAddress()

      expect(await token.balanceOf(notOwner2Address)).to.be.equal(0)

      await expect(token.connect(notOwner2).claimAllTokens({ value: price })).to.be.revertedWith('None to claim')
    })
    it('Should not be able to mint when already claimed', async () => {
      const { mockToken, token, notOwner } = testContext

      const price = await token.PRICE_ONI()

      const notOwnerAddress = await notOwner.getAddress()

      expect(await token.balanceOf(notOwnerAddress)).to.be.equal(0)

      await expect(token.ownerOf(299)).to.be.revertedWith('ERC721: owner query for nonexistent token')

      await mockToken.setOwnerOnis(notOwnerAddress, [299])

      await token.connect(notOwner).claimToken(299, { value: price })

      expect(await token.balanceOf(notOwnerAddress)).to.be.equal(1)

      expect(await token.ownerOf(299)).to.be.equal(notOwnerAddress)

      await expect(token.connect(notOwner).claimToken(299, { value: price })).to.be.revertedWith('Already minted')
    })
    it('Should not be able to mint someone else\'s token', async () => {
      const { mockToken, token, notOwner, notOwner2 } = testContext

      const price = await token.PRICE_ONI()

      const notOwnerAddress = await notOwner.getAddress()

      const notOwner2Address = await notOwner2.getAddress()

      expect(await token.balanceOf(notOwnerAddress)).to.be.equal(0)

      expect(await token.balanceOf(notOwner2Address)).to.be.equal(0)

      await expect(token.ownerOf(299)).to.be.revertedWith('ERC721: owner query for nonexistent token')

      await mockToken.setOwnerOnis(notOwnerAddress, [299])

      await expect(token.connect(notOwner2).claimToken(299, { value: price })).to.be.revertedWith('Not owned');

      expect(await token.balanceOf(notOwner2Address)).to.be.equal(0)

    })
  })
})
