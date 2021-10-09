import fs from 'fs'
import path from 'path'

import { ethers } from 'hardhat'


import config from '../../config'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getToken = async () => {
  const Token = await ethers.getContractFactory('OniGear')
  let token = null

  if (config.HARDHAT_NETWORK === 'rinkeby') {
    token = await Token.attach(config.RINKEBY_CONTRACT_ADDRESS)
  } else if (config.HARDHAT_NETWORK === 'mainnet') {
    token = await Token.attach(config.MAINNET_CONTRACT_ADDRESS)
  } else if (config.HARDHAT_NETWORK === 'hardhat') {
    // token = await Token.attach(config.MAINNET_CONTRACT_ADDRESS)
  }

  if (!token) {
    throw Error('No token found')
  }

  return token
}

export const getMockToken = async () => {
  const Token = await ethers.getContractFactory('OniMock')
  let token = null

  if (config.HARDHAT_NETWORK === 'rinkeby') {
    token = await Token.attach(config.RINKEBY_ONI_CONTRACT_ADDRESS)
  } else if (config.HARDHAT_NETWORK === 'mainnet') {
    // token = await Token.attach(config.MAINNET_ONI_CONTRACT_ADDRESS)
  } else if (config.HARDHAT_NETWORK === 'hardhat') {
    // token = await Token.attach(config.MAINNET_CONTRACT_ADDRESS)
  }

  if (!token) {
    throw Error('No token found')
  }

  return token
}
export const uniqueAddresses = () => {
  const addresses = fs.readFileSync(path.join(__dirname, 'output', 'snapshot_wallet.txt'))
}
