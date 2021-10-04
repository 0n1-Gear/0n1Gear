// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
// import hre from 'hardhat'
import { ethers } from 'hardhat'

import config from '../config'

async function main() {
  const [deployer] = await ethers.getSigners()
  const Token = await ethers.getContractFactory('0n1Gear')
  let token

  console.log('Deploying contracts using account:', deployer.address)
  console.log('Account balance:', ethers.utils.formatEther(await deployer.getBalance()))

  console.log('Executing Token deploy')

  if (config.HARDHAT_NETWORK === 'rinkeby') {
    token = await Token.deploy('TestGearNFT', 'TSTGEAR')
  } else if (config.HARDHAT_NETWORK === 'mainnet') {
    console.log('Deploying to mainnet...');
    token = await Token.deploy('0N1 Gear', '0N1GEAR')
  }

  if (!token) throw Error('No token found')

  await token.deployed()

  console.log('Account balance:', ethers.utils.formatEther(await deployer.getBalance()))
  console.log('Token deployed to:', token.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
