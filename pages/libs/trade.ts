/***
 *  交易实现流程：
 * 1. 定义代币和流动池
 * 2. 根据 pool 信息构建路由
 * 3. 生成交易参数
 * 4. 构建不受控制的交易
 * 5. 执行交易
 */

import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import { computePoolAddress, Pool, Route, SwapQuoter, Trade } from '@uniswap/v3-sdk'
import { Currency, CurrencyAmount, TradeType } from '@uniswap/sdk-core'
import { ethers } from 'ethers'
import { fromReadableAmount } from './utils'
import JSBI from 'jsbi'

import type { TokenTrade } from './type'

import { getProvider } from './walletProvider'
import { CurrentConfig } from '../config'
import { POOL_FACTORY_CONTRACT_ADDRESS, QUOTER_CONTRACT_ADDRESS } from './tradeConstants'

interface PoolInfo{
  token0: string
  token1: string
  fee: number
  tickSpacing: number
  sqrtPriceX96: ethers.BigNumber
  liquidity: ethers.BigNumber
  tick: number
}

export async function getPoolInfo(): Promise<PoolInfo>{
  const provider = getProvider()
  if (!provider) {
    throw new Error('No provider found')
  }
  const currentPoolAddress = computePoolAddress({
    factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
    tokenA: CurrentConfig.tokens.in,
    tokenB: CurrentConfig.tokens.out,
    fee: CurrentConfig.tokens.poolFee,
  })

  const poolContract = new ethers.Contract(
    currentPoolAddress,
    IUniswapV3PoolABI.abi,
    provider
  )  

  const [token0, token1, fee, tickSpacing, liquidity, slot0] =
  await Promise.all([
    poolContract.token0(),
    poolContract.token1(),
    poolContract.fee(),
    poolContract.tickSpacing(),
    poolContract.liquidity(),
    poolContract.slot0(),
  ])

    console.log("poolContract", token0, token1, fee, tickSpacing, liquidity, slot0);


  return {
    token0,
    token1,
    fee,
    tickSpacing,
    liquidity,
    sqrtPriceX96: slot0[0],
    tick: slot0[1],
  }
}

export async function createTrade(): Promise<TokenTrade>{
  const poolInfo = await getPoolInfo()

  const pool = new Pool(
    CurrentConfig.tokens.in,
    CurrentConfig.tokens.out,
    CurrentConfig.tokens.poolFee,
    poolInfo.sqrtPriceX96.toString(),
    poolInfo.liquidity.toString(),
    poolInfo.tick
  )

  const swapRoute = new Route(
    [pool],
    CurrentConfig.tokens.in,
    CurrentConfig.tokens.out
  )

  const amountOut = await getOutQuote(swapRoute)

  const uncheckedTrade = Trade.createUncheckedTrade({
    route: swapRoute,
    inputAmount: CurrencyAmount.fromRawAmount(
      CurrentConfig.tokens.in,
      fromReadableAmount(
        CurrentConfig.tokens.amountIn,
        CurrentConfig.tokens.in.decimals
      ).toString()
    ),
    outputAmount: CurrencyAmount.fromRawAmount(
      CurrentConfig.tokens.out,
      JSBI.BigInt(amountOut)
    ),
    tradeType: TradeType.EXACT_INPUT,
  })

  return uncheckedTrade
}

async function getOutQuote(route: Route<Currency, Currency>){
  const provider = getProvider()

  if (!provider) {
    throw new Error('No provider found')
  }

  const { calldata } = await SwapQuoter.quoteCallParameters(
    route,
    CurrencyAmount.fromRawAmount(
      CurrentConfig.tokens.in,
      fromReadableAmount(
        CurrentConfig.tokens.amountIn,
        CurrentConfig.tokens.in.decimals
      ).toString()
    ),
    TradeType.EXACT_INPUT,
    {
      useQuoterV2: true,
    }
  )

  const quoteCallReturnData = await provider.call({
    to: QUOTER_CONTRACT_ADDRESS,
    data: calldata,
  })

  console.log('quoteCallReturnData', quoteCallReturnData);
  

  return ethers.utils.defaultAbiCoder.decode(['uint256'], quoteCallReturnData)
}