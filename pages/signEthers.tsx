import React, { useEffect } from 'react'
import { ethers } from "ethers";

export default function signEthers() {

  async function getSigner(){
    const provider = new ethers.JsonRpcProvider("https://mainnet.infura.io/v3/a057417b28f748a0ace83fea5f0363bc");
    // 1. 创建钱包（含私钥）
    const privateKey = "0x1ecac2852c26aea26896a2a28046a5d75e40dab7e1a56ed0c9f885457d1e1bf8"; // 替换为你的私钥
    const wallet = new ethers.Wallet(privateKey, provider);
    

    // 2. 构造交易
    const tx = {
      to: "0x9Ff168FeF766DB18752Cfa77D899D6FF9772FaA5",
      value: ethers.parseEther("1.0"), // 发送 1 ETH
      gasLimit: 21000,
      gasPrice: ethers.parseUnits("10", "gwei"),
      nonce: await wallet.getNonce(),
    };

    // 3. 签名交易
    const signedTx = await wallet.signTransaction(tx);
    console.log("Signed Transaction:", signedTx);

    // 验签交易（解析签名并恢复地址）
    const parsedTx = ethers.Transaction.from(signedTx);
    const recoveredAddress = parsedTx.from;
    console.log("Recovered Address:", recoveredAddress);
    console.log("Is Valid?", recoveredAddress === wallet.address);
  }

  useEffect(() => {
    getSigner();
  }, [])
  

  return (
    <div>
      
    </div>
  )
}
