// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
// import hre from 'hardhat'
import { ethers } from 'hardhat'

import { getToken } from './helpers'

async function main() {
  const [deployer] = await ethers.getSigners()
  const token = await getToken()

  console.log('Using account:', deployer.address)
  console.log('Account balance:', ethers.utils.formatEther(await deployer.getBalance()))

  console.log('Executing withdrawing funds')

  const withdrawTx = await token.withdraw({
    maxFeePerGas: 100_000_000_000,
    maxPriorityFeePerGas: 2_000_000_000,
    // nonce: 1,
  })
  await withdrawTx.wait()

  console.log('Finished withdrawing funds')
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
