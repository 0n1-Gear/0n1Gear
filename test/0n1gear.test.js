const { assert } = require("chai");
const { expectRevert } = require('@openzeppelin/test-helpers');

const OniGear = artifacts.require("./OniGear.sol");
const MockContract = artifacts.require("./OniMock.sol");

require("chai").use(require("chai-as-promised")).should();

contract("OniGear", (accounts) => {
  describe("deployment", async () => {
    it("deploys successfully", async () => {
      contract = await OniGear.deployed();
      const address = contract.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it("has a name", async () => {
      const name = await contract.name();
      assert.equal(name, "0N1 Gear");
    });

    it("has a symbol", async () => {
      const symbol = await contract.symbol();
      assert.equal(symbol, "0N1GEAR");
    });
  });

  describe("Setup allow list& mock contract", async () => {
    it("Set contract to active", async () => {
      await expectRevert(contract.claimAllTokens(),'Contract inactive');
      contract.setIsActive(true);
      await expectRevert(contract.claimAllTokens(),'Allow List inactive');
    });
    it("Mock contract deploy", async () => {
      mockContract = await MockContract.deployed();
      const address = mockContract.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });
    it("Set contract for On1Contract", async () => {
      contract.setOniContractAddress(mockContract.address);
    });
  });

  describe("Mint all from Allow List 0n1 Gear", async () => {
    it("Mint from allow list before active", async () => {
        await expectRevert.unspecified(contract.claimAllTokens({
          from: accounts[0],
          value: web3.utils.toWei("0.01"),
        })
      );
    });
    it("Activate allow list", async () => {
      await contract.setIsAllowListActive(true);
    });
    it("Mint not from allow list", async () => {     
        await expectRevert.unspecified(contract.claimAllTokens({
          from: accounts[5],
          value: web3.utils.toWei("0.01"),
        })
      );
    });
    it("Mint where has existing Oni", async () => {
      mockContract.setOwnerOnis(accounts[0], [99]);
      const result = await contract.claimAllTokens({
        from: accounts[0],
        value: web3.utils.toWei("0.01"),
      });
      const totalSupply = await contract.totalSupply();
      assert.equal(totalSupply, 1);
      const event = result.logs[0].args;
      assert.equal(event.tokenId.toNumber(), 99, "id is correct");
      assert.equal(
        event.from,
        "0x0000000000000000000000000000000000000000",
        "from is correct"
      );
      assert.equal(event.to, accounts[0], "to is correct");
      const tokenDetails = await contract.tokenURI("99");
      console.log(tokenDetails);
    });
    it("Mint again after allow list allocation empty", async () => {      
        await expectRevert.unspecified(contract.claimAllTokens({
          from: accounts[0],
          value: web3.utils.toWei("0.01"),
        })
      );
    });
    it("Mint multiple from allow list", async () => {
       await mockContract.setOwnerOnis(accounts[3], [1,1000,3000,5600]);
      const result = await contract.claimAllTokens({
        from: accounts[3],
        value: web3.utils.toWei("0.04"),
      });
      const totalSupply = await contract.totalSupply();
      assert.equal(totalSupply, 5);
      const event1 = result.logs[0].args;
      const event2 = result.logs[1].args;
      const event3 = result.logs[2].args;
      const event4 = result.logs[3].args;
      assert.equal(event1.tokenId.toNumber(), 1, "id is correct");
      assert.equal(
        event1.from,
        "0x0000000000000000000000000000000000000000",
        "from is correct"
      );
      assert.equal(event1.to, accounts[3], "to is correct");
      assert.equal(event2.tokenId.toNumber(), 1000, "id is correct");
      assert.equal(
        event2.from,
        "0x0000000000000000000000000000000000000000",
        "from is correct"
      );
      assert.equal(event2.to, accounts[3], "to is correct");
      assert.equal(event3.tokenId.toNumber(), 3000, "id is correct");
      assert.equal(
        event3.from,
        "0x0000000000000000000000000000000000000000",
        "from is correct"
      );
      assert.equal(event3.to, accounts[3], "to is correct");
      assert.equal(event4.tokenId.toNumber(), 5600, "id is correct");
      assert.equal(
        event4.from,
        "0x0000000000000000000000000000000000000000",
        "from is correct"
      );
      assert.equal(event4.to, accounts[3], "to is correct");
    });
    it("Mint again after multiple allow list allocation empty", async () => {
        await expectRevert.unspecified(
        contract.claimAllTokens({
          from: accounts[3],
          value: web3.utils.toWei("0.01"),
        })
      );
    });
    it("Mint multiple from allow list in two separate events", async () => {
        await mockContract.setOwnerOnis(accounts[2], [6,1002]);
      const result = await contract.claimAllTokens({
        from: accounts[2],
        value: web3.utils.toWei("0.02"),
      });
      const totalSupply = await contract.totalSupply();
      assert.equal(totalSupply, 7);
      const event1 = result.logs[0].args;
      const event2 = result.logs[1].args;
      assert.equal(event1.tokenId.toNumber(), 6, "id is correct");
      assert.equal(
        event1.from,
        "0x0000000000000000000000000000000000000000",
        "from is correct"
      );
      assert.equal(event1.to, accounts[2], "to is correct");
      assert.equal(event2.tokenId.toNumber(), 1002, "id is correct");
      assert.equal(
        event2.from,
        "0x0000000000000000000000000000000000000000",
        "from is correct"
      );
      assert.equal(event2.to, accounts[2], "to is correct");
      await mockContract.setOwnerOnis(accounts[2], [6,1002,3003]);
      const result2 = await contract.claimAllTokens({
        from: accounts[2],
        value: web3.utils.toWei("0.01"),
      });
      const totalSupply2 = await contract.totalSupply();
      assert.equal(totalSupply2, 8);
      const event3 = result2.logs[0].args;
      assert.equal(event3.tokenId.toNumber(), 3003, "id is correct");
      assert.equal(
        event3.from,
        "0x0000000000000000000000000000000000000000",
        "from is correct"
      );
      assert.equal(event3.to, accounts[2], "to is correct");
    });
    it("Mint all again after separate allow list events - allocation empty", async () => {
        await expectRevert(
        contract.claimAllTokens({
          from: accounts[2],
          value: web3.utils.toWei("0.01"),
        }),
        'No Tokens left to mint'
      );
    });
    it("Mint where allow list allocation empty", async () => {
        await expectRevert(
        contract.claimAllTokens({
          from: accounts[1],
          value: web3.utils.toWei("0.01"),
        }),
        "No Tokens to mint"
      );
    });
  });
  
  describe("Mint singles from Allow List 0n1 Gear", async () => {
    it("Deactivate allow list", async () => {
      await contract.setIsAllowListActive(false);
    });
    it("Mint from allow list before active", async () => {
        await expectRevert.unspecified(contract.claimToken(299,{
          from: accounts[7],
          value: web3.utils.toWei("0.01"),
        })
      );
    });
    it("Activate allow list", async () => {
      await contract.setIsAllowListActive(true);
    });
    it("Mint not from allow list", async () => {     
        await expectRevert.unspecified(contract.claimToken(299,{
          from: accounts[5],
          value: web3.utils.toWei("0.01"),
        })
      );
    });
    it("Mint where has single existing Oni, not claimed", async () => {
      mockContract.setOwnerOnis(accounts[7], [299]);
      const result = await contract.claimToken(299,{
        from: accounts[7],
        value: web3.utils.toWei("0.01"),
      });
      const totalSupply = await contract.totalSupply();
      assert.equal(totalSupply, 9);
      const event = result.logs[0].args;
      assert.equal(event.tokenId.toNumber(), 299, "id is correct");
      assert.equal(
        event.from,
        "0x0000000000000000000000000000000000000000",
        "from is correct"
      );
      assert.equal(event.to, accounts[7], "to is correct");
    });
    it("Mint where has single existing Oni already caimed", async () => {
        await expectRevert(contract.claimToken(299,{
        from: accounts[7],
        value: web3.utils.toWei("0.01"),
      }),'Already minted');
      const totalSupply = await contract.totalSupply();
      assert.equal(totalSupply, 9);
    });
    it("Mint where multiple allowed list", async () => {
       await mockContract.setOwnerOnis(accounts[8], [301,2002,3004,5700]);
      const result = await contract.claimToken(301,{
        from: accounts[8],
        value: web3.utils.toWei("0.01"),
      });
      const totalSupply = await contract.totalSupply();
      assert.equal(totalSupply, 10);
      const event1 = result.logs[0].args;
      assert.equal(event1.tokenId.toNumber(), 301, "id is correct");
      assert.equal(
        event1.from,
        "0x0000000000000000000000000000000000000000",
        "from is correct"
      );
      assert.equal(event1.to, accounts[8], "to is correct");      
    });
    it("Mint another one from the same account", async () => {
      const result = await contract.claimToken(2002,{
        from: accounts[8],
        value: web3.utils.toWei("0.01"),
      });
      const totalSupply = await contract.totalSupply();
      assert.equal(totalSupply, 11);
      const event1 = result.logs[0].args;
      assert.equal(event1.tokenId.toNumber(), 2002, "id is correct");
      assert.equal(
        event1.from,
        "0x0000000000000000000000000000000000000000",
        "from is correct"
      );
    });
    it("Try and mint from someone else's 0N1s where it is unclaimed where owns none", async () => {      
      await expectRevert(contract.claimToken(3004,{
        from: accounts[9],
        value: web3.utils.toWei("0.01"),
      }),'No Tokens to mint');
      const totalSupply = await contract.totalSupply();
      assert.equal(totalSupply, 11);      
    });    
    it("Try and mint from someone else's 0N1s where it is unclaimed where owns others", async () => {      
        await mockContract.setOwnerOnis(accounts[9], [5701,5702]);
      await expectRevert(contract.claimToken(3004,{
        from: accounts[9],
        value: web3.utils.toWei("0.01"),
      }),'Not authorised');
      const totalSupply = await contract.totalSupply();
      assert.equal(totalSupply, 11);      
    });   
  });
  describe("Public Minting 0n1 Gear", async () => {
    it("Confirm account not on allow list", async () => {
        await expectRevert.unspecified(
        contract.claimAllTokens({
          from: accounts[6],
          value: web3.utils.toWei("0.01"),
        })
      );
    });
    it("Mint whilst allow list still in place", async () => {
        await expectRevert.unspecified(
        contract.purchase(1, {
          from: accounts[6],
          value: web3.utils.toWei("0.01"),
        })
      );
    });
    it("Deactivate allow list", async () => {
      await contract.setIsAllowListActive(false);
    });
    it("Check allow list minting finished", async () => {
        await expectRevert.unspecified(
        contract.claimAllTokens({
          from: accounts[4],
          value: web3.utils.toWei("0.01"),
        })
      );
    });
    it("Mint from public mint", async () => {
      const result = await contract.purchase(1, {
        from: accounts[6],
        value: web3.utils.toWei("0.01"),
      });
      const totalSupply = await contract.totalSupply();
      console.log('total supply = ',totalSupply, result);
    //   assert.equal(totalSupply, 9);
      const event = result.logs[0].args;
      console.log('new token = ',event.tokenId);
      assert.equal(event.tokenId.toNumber(), 2, "id is correct");
      assert.equal(
        event.from,
        "0x0000000000000000000000000000000000000000",
        "from is correct"
      );
      assert.equal(event.to, accounts[6], "to is correct");
    });
    it("Mint multiple from public mint", async () => {
      const result = await contract.purchase(4, {
        from: accounts[6],
        value: web3.utils.toWei("0.04"),
      });
      const totalSupply = await contract.totalSupply();
    //   assert.equal(totalSupply, 13);
      const event1 = result.logs[0].args;
      const event2 = result.logs[1].args;
      const event3 = result.logs[2].args;
      const event4 = result.logs[3].args;
      assert.equal(event1.tokenId.toNumber(), 3, "id is correct");
      assert.equal(
        event1.from,
        "0x0000000000000000000000000000000000000000",
        "from is correct"
      );
      assert.equal(event1.to, accounts[6], "to is correct");
      assert.equal(event2.tokenId.toNumber(), 4, "id is correct");
      assert.equal(
        event2.from,
        "0x0000000000000000000000000000000000000000",
        "from is correct"
      );
      assert.equal(event2.to, accounts[6], "to is correct");
      assert.equal(event3.tokenId.toNumber(), 5, "id is correct");
      assert.equal(
        event3.from,
        "0x0000000000000000000000000000000000000000",
        "from is correct"
      );
      assert.equal(event3.to, accounts[6], "to is correct");
      assert.equal(event4.tokenId.toNumber(), 7, "id is correct");
      assert.equal(
        event4.from,
        "0x0000000000000000000000000000000000000000",
        "from is correct"
      );
      assert.equal(event4.to, accounts[6], "to is correct");
    });
    it("Mint too many from public mint", async () => {     
        await expectRevert(
        contract.purchase(10, {
          from: accounts[5],
          value: web3.utils.toWei("0.10"),
        }),'Too much On1Gear'
      );
    });
  });
});
