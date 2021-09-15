const { assert } = require('chai');

const OniGear = artifacts.require('./OniGear.sol');

require('chai').use(require('chai-as-promised')).should()

contract('OniGear', (accounts)=>{
 describe('deployment', async()=>{
     it('deploys successfully', async()=>{
         contract = await OniGear.deployed();
         const address = contract.address;
         assert.notEqual(address, 0x0)
         assert.notEqual(address, '')
         assert.notEqual(address, null)
         assert.notEqual(address, undefined)
     });
     
    it('has a name', async () => {
        const name = await contract.name()
        assert.equal(name, '0N1 Gear')
      })
  
      it('has a symbol', async () => {
        const symbol = await contract.symbol()
        assert.equal(symbol, '0N1GEAR')
      })
 });
 describe('minting', async () => {

    it('creates a new token', async () => {
      const result = await contract.claim(1)
      const totalSupply = await contract.totalSupply()
      // SUCCESS
      assert.equal(totalSupply, 1)
      const event = result.logs[0].args
      assert.equal(event.tokenId.toNumber(), 1, 'id is correct')
      assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from is correct')
      assert.equal(event.to, accounts[0], 'to is correct')
    })
  })
});