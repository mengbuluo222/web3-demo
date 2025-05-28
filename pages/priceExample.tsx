import React, { useState, useCallback } from 'react'
import { CurrentConfig } from './config'
import { quote } from './libs/quote'

export default function example() {
  const [outputAmount, setOutputAmount] = useState(0);
  const onQuote = useCallback(async () => {
    setOutputAmount(await quote());
  }, []);
  
  return (
    <div>
      {CurrentConfig.rpc.mainnet === '' && (
        <h2 className="error">Please set your mainnet RPC URL in config.ts</h2>
      )}

      <h3>{`Quote input amount: ${CurrentConfig.tokens.amountIn} ${CurrentConfig.tokens.in.symbol}`}</h3>
      <h3>{`Quote output amount: ${outputAmount} ${CurrentConfig.tokens.out.symbol}`}</h3>

      <button onClick={onQuote}>
        <p>Quote</p>
      </button>
    </div>
  )
}
