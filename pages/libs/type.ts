import { Token, TradeType } from '@uniswap/sdk-core'
import { Trade } from '@uniswap/v3-sdk'

export type TokenTrade = Trade<Token, Token, TradeType>