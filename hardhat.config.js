/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 require("@nomiclabs/hardhat-truffle5");
 require("hardhat-gas-reporter");
 require("solidity-coverage");
 require('hardhat-contract-sizer');

module.exports = {
  solidity: "0.8.6",
  settings: {
    optimizer: {
      enabled: true,
      runs: 10000,
    },
  },
};
