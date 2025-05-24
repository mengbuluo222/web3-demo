import React, { useState } from 'react';
import WtfLayout from "../components/WtfLayout";
import { Card, Input, Button, Space, Typography } from 'antd';
import styles from "../components/WtfLayout/styles.module.css";
import { TokenSelect, type Token } from '@ant-design/web3';
import { ETH, USDT, USDC } from '@ant-design/web3-assets/tokens';
import { SwapOutlined } from '@ant-design/icons';

const { Text } = Typography;


export default function Wtfswap() {
  const [tokenA, setTokenA] = useState<Token>(ETH);
  const [tokenB, setTokenB] = useState<Token>(USDT);
  const [amountA, setAmountA] = useState<number>(0);
  const [amountB, setAmountB] = useState<number>(0);
  const [optionsA, setOptionsA] = useState<Token[]>([ETH, USDT, USDC]);
  const [optionsB, setOptionsB] = useState<Token[]>([USDT, ETH, USDC]);

  const handleAmountAChange = (e:any)  => {
    setAmountA(parseFloat(e.target.value));
  };

  const handleSwitch = () => {
    setTokenA(tokenB);
    setTokenB(tokenA);
    setAmountA(amountB);
    setAmountB(amountA);
  }

  const handleMax = () => {

  }

  return (
    <WtfLayout>
      <Card title="Swap" className={styles.swapCard}>
        <Card>
          <Input
            value={amountA}
            variant="borderless"
            type="number"
            addonAfter={
              <TokenSelect value={tokenA} onChange={setTokenA} options={optionsA} />
            }
            onChange={(e) => handleAmountAChange(e)}
          ></Input>
          <Space className={styles.swapSpace}>
            <Text type="secondary">$ 0.0</Text>
            <Space>
              <Text type="secondary">Balance: 0.00</Text>
            </Space>
            <Button size="small" type="link" onClick={handleMax}>Max</Button>
          </Space>
        </Card>
        
        <Space className={styles.switchBtn}>
          <Button shape="circle" icon={<SwapOutlined />} onClick={handleSwitch}></Button>
        </Space>

        <Card>
          <Input
            value={amountB}
            variant="borderless"
            type="number"
            addonAfter={
              <TokenSelect value={tokenB} onChange={setTokenB} options={optionsB} />
            }
          ></Input>
          <Space className={styles.swapSpace}>
            <Text type="secondary">$ 0.0</Text>
            <Space>
              <Text type="secondary">Balance: 0.00</Text>
            </Space>
          </Space>
        </Card>
        <Button type="primary" size="large" block className={styles.swapBtn}>Swap</Button>
      </Card>
    </WtfLayout>
  )
}
