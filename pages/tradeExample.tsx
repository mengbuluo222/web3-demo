import React, { useCallback, useEffect, useState } from 'react'
import { CurrentConfig, Environment } from './config'
import { getProvider, getWalletAddress } from './libs/walletProvider'
import { createTrade } from './libs/trade'
import { TokenTrade } from './libs/type'
import { getCurrencyBalance } from './libs/wallet'

export default function tradeExample() {
  const [trade, setTrade] = useState<TokenTrade>()
  const [tokenInBalance, setTokenInBalance] = useState<string>()
  const [tokenOutBalance, setTokenOutBalance] = useState<string>()

  const refreshBalances = useCallback(async () => {
    const provider = getProvider()
    const address = getWalletAddress()

    if(!address || !provider){
      return
    }

    setTokenInBalance(
      await getCurrencyBalance(provider, address, CurrentConfig.tokens.in)
    )
    setTokenOutBalance(
      await getCurrencyBalance(provider, address, CurrentConfig.tokens.out)
    )
  }, [])

  const onCreateTrade = useCallback(async () => {
    console.log('30', trade);
    
    refreshBalances()
    setTrade(await createTrade())
  }, [refreshBalances])

  return (
    <div>
      {CurrentConfig.rpc.mainnet === '' && (
        <h2 className="error">Please set your mainnet RPC URL in config.ts</h2>
      )}
      {CurrentConfig.env === Environment.WALLET_EXTENSION &&
        getProvider() === null && (
          <h2 className="error">
            Please install a wallet to use this example configuration
          </h2>
        )}

      <h3>
        Trading {CurrentConfig.tokens.amountIn} {CurrentConfig.tokens.in.symbol}{' '}
        for {CurrentConfig.tokens.out.symbol}
      </h3>
      <button onClick={onCreateTrade}>
        <p>Create Trade</p>
      </button>
    </div>
  )
}
