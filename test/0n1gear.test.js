const { assert } = require('chai');

const OniGear = artifacts.require('./OniGear.sol');
const truffleAssert = require('truffle-assertions');

require('chai').use(require('chai-as-promised')).should()

contract('OniGear', (accounts) => {
    describe('deployment', async () => {
        it('deploys successfully', async () => {
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

    describe('Setup allow list', async () => {

        it('Set contract to active', async () => {
            await truffleAssert.reverts(contract.claimAllowList(1));
            contract.setIsActive(true);
            await truffleAssert.reverts(contract.claimAllowList(1));
        })

        it('Add addresses to allow list', async () => {
            const amountOfGas = await contract.addToAllowList.estimateGas([accounts[0], accounts[1], accounts[2], accounts[3]], [1, 0, 3, 4]);
            await contract.addToAllowList([accounts[0], accounts[1], accounts[2], accounts[3]], [1, 0, 3, 4]);
        });
    })

    describe('minting 0n1 Gear', async () => {

        it('Mint from allow list before active', async () => {
            await truffleAssert.reverts(contract.claimAllowList(1, { from: accounts[0], value: web3.utils.toWei('0.01') }));
        });
        it('Activate allow list', async () => {
            await contract.setIsAllowListActive(true);
        });
        it('Mint not from allow list', async () => {
            await truffleAssert.reverts(contract.claimAllowList(1, { from: accounts[5], value: web3.utils.toWei('0.01') }));
        })
        it('Mint from allow list', async () => {
            const result = await contract.claimAllowList(1, { from: accounts[0], value: web3.utils.toWei('0.01') });
            const totalSupply = await contract.totalSupply()
            assert.equal(totalSupply, 1)
            const tokenDetails = await contract.tokenURI("1");
            console.log(tokenDetails)
            const event = result.logs[0].args
            assert.equal(event.tokenId.toNumber(), 1, 'id is correct')
            assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from is correct')
            assert.equal(event.to, accounts[0], 'to is correct');
        });
        it('Mint again after allow list allocation empty', async () => {
            await truffleAssert.reverts(contract.claimAllowList(1, { from: accounts[0], value: web3.utils.toWei('0.01') }));
        });
        it('Mint multiple from allow list', async () => {
            const result = await contract.claimAllowList(4, { from: accounts[3], value: web3.utils.toWei('0.04') });
            const totalSupply = await contract.totalSupply()
            assert.equal(totalSupply, 5)
            const event1 = result.logs[0].args
            const event2 = result.logs[1].args
            const event3 = result.logs[2].args
            const event4 = result.logs[3].args
            assert.equal(event1.tokenId.toNumber(), 2, 'id is correct')
            assert.equal(event1.from, '0x0000000000000000000000000000000000000000', 'from is correct')
            assert.equal(event1.to, accounts[3], 'to is correct')
            assert.equal(event2.tokenId.toNumber(), 3, 'id is correct')
            assert.equal(event2.from, '0x0000000000000000000000000000000000000000', 'from is correct')
            assert.equal(event2.to, accounts[3], 'to is correct')
            assert.equal(event3.tokenId.toNumber(), 4, 'id is correct')
            assert.equal(event3.from, '0x0000000000000000000000000000000000000000', 'from is correct')
            assert.equal(event3.to, accounts[3], 'to is correct')
            assert.equal(event4.tokenId.toNumber(), 5, 'id is correct')
            assert.equal(event4.from, '0x0000000000000000000000000000000000000000', 'from is correct')
            assert.equal(event4.to, accounts[3], 'to is correct')
        });
        it('Mint again after multiple allow list allocation empty', async () => {
            await truffleAssert.reverts(contract.claimAllowList(1, { from: accounts[3], value: web3.utils.toWei('0.01') }));
        });
        it('Mint multiple from allow list in two separate events', async () => {
            const result = await contract.claimAllowList(2, { from: accounts[2], value: web3.utils.toWei('0.02') });
            const totalSupply = await contract.totalSupply()
            assert.equal(totalSupply, 7)
            const event1 = result.logs[0].args
            const event2 = result.logs[1].args
            assert.equal(event1.tokenId.toNumber(), 6, 'id is correct')
            assert.equal(event1.from, '0x0000000000000000000000000000000000000000', 'from is correct')
            assert.equal(event1.to, accounts[2], 'to is correct')
            assert.equal(event2.tokenId.toNumber(), 7, 'id is correct')
            assert.equal(event2.from, '0x0000000000000000000000000000000000000000', 'from is correct')
            assert.equal(event2.to, accounts[2], 'to is correct')
            const result2 = await contract.claimAllowList(1, { from: accounts[2], value: web3.utils.toWei('0.01') });
            const totalSupply2 = await contract.totalSupply()
            assert.equal(totalSupply2, 8)
            const event3 = result2.logs[0].args
            assert.equal(event3.tokenId.toNumber(), 8, 'id is correct')
            assert.equal(event3.from, '0x0000000000000000000000000000000000000000', 'from is correct')
            assert.equal(event3.to, accounts[2], 'to is correct')
        });
        it('Mint again after separate allow list events - allocation empty', async () => {
            await truffleAssert.reverts(contract.claimAllowList(1, { from: accounts[2], value: web3.utils.toWei('0.01') },), 'Not on Allow List');
        });
    })
});