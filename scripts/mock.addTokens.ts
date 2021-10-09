// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
// import hre from 'hardhat'
import { ethers } from 'hardhat'

import { getMockToken } from './helpers'
import config from '../config'
import { getAddress } from 'ethers/lib/utils'

async function main() {
  const [deployer] = await ethers.getSigners()
  const token = await getMockToken()

  console.log('Using account:', deployer.address)
  console.log('Account balance:', ethers.utils.formatEther(await deployer.getBalance()))

  console.log('Executing add Token to mock')
  let address

  if (config.HARDHAT_NETWORK === 'rinkeby') {
    address =  getAddress('0x9BCFA6C3EB012e7Ff6d6Ac300e603478d0384277')
  } else if (config.HARDHAT_NETWORK === 'mainnet') {address = config.MAINNET_ONI_CONTRACT_ADDRESS
  }

  const addContractOnis = await token.setOwnerOnis(address, [7105,7106,7107,7108,7109,7110], {
    maxFeePerGas: 60_000_000_000,
    maxPriorityFeePerGas: 2_000_000_000,
    // nonce: 1,
  })
  await addContractOnis.wait()

  console.log('Finished add Token to mock')
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
