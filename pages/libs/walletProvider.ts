import { BaseProvider } from '@ethersproject/providers'
import { BigNumber, ethers, providers } from 'ethers'
import { CurrentConfig, Environment } from '../config'

const mainnetProvider = new ethers.providers.JsonRpcProvider(
  CurrentConfig.rpc.mainnet
)
const wallet = createWallet()
const browserExtensionProvider = createBrowserExtensionProvider()
let walletExtensionAddress: string | null = null

export function getProvider(): providers.Provider | null {
  return CurrentConfig.env === Environment.WALLET_EXTENSION
    ? browserExtensionProvider
    : wallet.provider
}

export function getWalletAddress(): string | null{
  return CurrentConfig.env === Environment.WALLET_EXTENSION
    ? walletExtensionAddress
    : wallet.address
}

// 创建钱包
function createWallet():ethers.Wallet {
  let provider = mainnetProvider;
  if (CurrentConfig.env == Environment.LOCAL) {
    provider = new ethers.providers.JsonRpcProvider(CurrentConfig.rpc.local)
  }
  return new ethers.Wallet(CurrentConfig.wallet.privateKey, provider)
}

// 创建浏览器扩展钱包
function createBrowserExtensionProvider(): ethers.providers.Web3Provider | null{
  try{
    return new ethers.providers.Web3Provider(window?.ethereum, 'any');
  } catch(e){
    console.log('No wallet extension found')
    return null;
    
  }
}

// 连接浏览器插件钱包
export async function connectBrowserExtensionWallet() {
  if (!window.ethereum) {
    return null
  }

  const { ethereum } = window
  const provider = new ethers.providers.Web3Provider(ethereum)
  const accounts = await provider.send('eth_requestAccounts', [])

  if (accounts.length !== 1) {
    return
  }

  walletExtensionAddress = accounts[0]
  return walletExtensionAddress
}