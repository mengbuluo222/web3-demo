/***
 *  获取交易对的报价的实现流程：
 * 1. 通过合约地址获取交易对的合约实例
 * 2. 通过交易对的合约实例获取交易对的信息
 * 3. 通过交易对的信息获取交易对的价格
 * 4. 返回交易对的价格
 */
import { ethers } from 'ethers'
import { toReadableAmount, fromReadableAmount } from './utils'
import { getProvider } from './providers'
import Quoter from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json'
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import { computePoolAddress } from '@uniswap/v3-sdk' 
import { CurrentConfig } from '../config'

import {
  POOL_FACTORY_CONTRACT_ADDRESS,
  QUOTER_CONTRACT_ADDRESS,
} from '../libs/constants'


export async function quote():Promise<string> {
  const quoterContract = new ethers.Contract(
    QUOTER_CONTRACT_ADDRESS,
    Quoter.abi,
    getProvider()
  )
  // 获取交易对的信息 
  const poolConstants = await getPoolConstants()

  // 获取交易对的价格 callStatic模拟状态更改，但不执行，节省gas

  /***
   * quoteExactInputSingle 是 Uniswap V3 的 Quoter 合约中的一个方法，用于模拟计算在给定输入金额的情况下，能获得的预期输出代币数量。它通常用于在不实际执行交易的情况下获取报价。
   * 
   * 这个方法接受以下参数：
   *
   * tokenIn: 输入代币的地址。
   * tokenOut: 输出代币的地址。
   * fee: 交易池的手续费。
   * amountIn: 输入代币的数量，以最小单位表示。
   * sqrtPriceLimitX96: 价格限制的平方根值，用于限制交易的价格范围。 可选参数；设置为 0 表示不限制，使用整个池子的价格范围进行计算。
   *
  */
  const quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
    poolConstants.token0,
    poolConstants.token1,
    poolConstants.fee,
    fromReadableAmount(
      CurrentConfig.tokens.amountIn,
      CurrentConfig.tokens.in.decimals
    ).toString(),
    0
  )

  return toReadableAmount(quotedAmountOut, CurrentConfig.tokens.out.decimals)
}

async function getPoolConstants(): Promise<{
  token0: string
  token1: string
  fee: number
}> {
  // 计算交易池的部署地址
  const currentPoolAddress = computePoolAddress({
    factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
    tokenA: CurrentConfig.tokens.in,
    tokenB: CurrentConfig.tokens.out,
    fee: CurrentConfig.tokens.poolFee,
  })
  // 获取交易池的合约实例
  const poolContract = new ethers.Contract(
    currentPoolAddress,
    IUniswapV3PoolABI.abi,
    getProvider()
  )
  // 获取交易池的信息
  const [token0, token1, fee] = await Promise.all([
    poolContract.token0(),
    poolContract.token1(),
    poolContract.fee(),
  ])

  return {
    token0,
    token1,
    fee,
  }
}
