import { task } from 'hardhat/config'
import '@nomiclabs/hardhat-waffle'
import '@nomiclabs/hardhat-etherscan'
import 'hardhat-contract-sizer';

import config from './config'

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (args, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: 'hardhat',
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
    },
    hardhat: {
      chainId: 31337, // The chain ID number used by Hardhat Network's blockchain. Default value: 31337
      // from: "", // The address to use as default sender. If not present the first account of the Hardhat Network is used.
      gas: 'auto', // Its value should be "auto" or a number. If a number is used, it will be the gas limit used by default in every transaction. If "auto" is used, the gas limit will be automatically estimated.
      gasPrice: 'auto', // Its value should be "auto" or a number. This parameter behaves like gas
      gasMultiplier: 1.2, // A number used to multiply the results of gas estimation to give it some slack due to the uncertainty of the estimation process
      accounts: {
        mnemonic: 'junk test test test test test test test test test test test', // a 12 or 24 word mnemonic phrase as defined by BIP39. Default value: "test test test test test test test test test test test junk"
        initialIndex: 0, // The initial index to derive. Default value: 0.
        path: "m/44'/60'/0'/0", // The HD parent of all the derived keys. Default value: "m/44'/60'/0'/0"
        count: 20, // The number of accounts to derive. Default value: 20
        accountsBalance: '10000000000000000000000', // Default value: "10000000000000000000000" (10000 ETH)
      },
      blockGasLimit: 30_000_000, // The block gas limit to use in Hardhat Network's blockchain
      hardfork: 'london', // This setting changes how Hardhat Network works, to mimic Ethereum's mainnet at a given hardfork. It must be one of "byzantium", "constantinople", "petersburg", "istanbul", "muirGlacier", "berlin", "london"
      throwOnTransactionFailures: true, // A boolean that controls if Hardhat Network throws on transaction failures
      throwOnCallFailures: true, // A boolean that controls if Hardhat Network throws on call failures. If this value is true
      // loggingEnabled: false, // A boolean that controls if Hardhat Network logs every request or not
      // initialDate: Date(), // An optional string setting the date of the blockchain. Valid values are Javascript's date time strings
      allowUnlimitedContractSize: false, // An optional boolean that disables the contract size limit imposed by the EIP 170
      // forking: {
      //   url: `https://eth-mainnet.alchemyapi.io/v2/${config.ALCHEMY_MAINNET_KEY}`,
      //   blockNumber: parseInt(config.MAINNET_BLOCKNUMBER),
      // }
      // initialBaseFeePerGas: 0
    },
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${config.ALCHEMY_RINKEBY_KEY}`,
      accounts: [`0x${config.RINKEBY_PRIVATE_KEY}`],
    },
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${config.ALCHEMY_MAINNET_KEY}`,
      accounts: [`0x${config.DANGEROUS_MAINNET_PRIVATE_KEY}`],
    },
  },
  etherscan: {
    apiKey: config.ETHERSCAN_API_KEY, // Used for contract verification on Etherscan.io
  },
  solidity: {
    version: '0.8.6',
    settings: {
      optimizer: {
        enabled: true,
        runs: 100,
      },
    },
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
  mocha: {
    timeout: 20000,
  },
}
