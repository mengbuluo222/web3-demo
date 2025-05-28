import { Currency } from '@uniswap/sdk-core'
import { BigNumber, ethers } from 'ethers'
import { providers } from 'ethers'
import JSBI from 'jsbi'
import { toReadableAmount, fromReadableAmount } from './utils'
import { ERC20_ABI } from './constants'

export async function getCurrencyBalance(
  provider: providers.Provider,
  address: string | null,
  currency: Currency
):Promise<string>{
  // isNative 表示是否为原生代币
  if (currency.isNative) {
    return ethers.utils.formatEther(await provider.getBalance(address))
  }

  // 否则为 ERC20 代币
  const ERC20Contract = new ethers.Contract(
    currency.address,
    ERC20_ABI,
    provider
  )
  const balance: number = await ERC20Contract.balanceOf(address)
  const decimals: number = await ERC20Contract.decimals()

  return toReadableAmount(balance, decimals)
}