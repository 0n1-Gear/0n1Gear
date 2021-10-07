// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
// import hre from 'hardhat'
import { ethers } from 'hardhat'

import { getToken } from './helpers'
import config from '../config'

async function main() {
  const [deployer] = await ethers.getSigners()
  const token = await getToken()

  console.log('Using account:', deployer.address)
  console.log('Account balance:', ethers.utils.formatEther(await deployer.getBalance()))

  console.log('Executing setOniContractAddress')
  let address

  if (config.HARDHAT_NETWORK === 'rinkeby') {
    address = config.RINKEBY_ONI_CONTRACT_ADDRESS
  } else if (config.HARDHAT_NETWORK === 'mainnet') {
    address = config.MAINNET_ONI_CONTRACT_ADDRESS
  }

  const setOniContractAddressTx = await token.setOniContractAddress(address, {
    maxFeePerGas: 60_000_000_000,
    maxPriorityFeePerGas: 2_000_000_000,
    // nonce: 1,
  })
  await setOniContractAddressTx.wait()

  console.log('Finished setOniContractAddress')
  console.log('Account balance:', ethers.utils.formatEther(await deployer.getBalance()))
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
