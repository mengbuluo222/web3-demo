"use client"
import React, {useEffect} from 'react'
import { ethers } from 'ethers'
import * as contractJson from "./contract.json" assert {type: "json"};


export default function page() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      

      signHandler()
      
    }
  }, [])
  //钱包信息签名
  const signHandler = async () => {
    // 1. 创建provider和wallet对象
    const ALCHEMY_GOERLI_URL = 'http://localhost:8545';
    const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_GOERLI_URL);

    // 利用私钥和provider创建wallet对象
    const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
    const wallet = new ethers.Wallet(privateKey, provider)
    // 2. 根据allowlist地址和tokenId生成msgHash，并签名
    const account = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    const tokenId = 0;

    
    

    // 3. 创建合约工厂
    // const abiNFT = contractJson.abi;
     const abiNFT = [
        "constructor(string memory _name, string memory _symbol, address _signer)",
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function mint(address _account, uint256 _tokenId, bytes memory _signature) external",
        "function ownerOf(uint256) view returns (address)",
        "function balanceOf(address) view returns (uint256)",
    ];

    const bytecodeNFT = contractJson.bytecode;
    //ContractFactory(abi , bytecode , signer) Wallet 是 Signer 的子类，它可以作为 signer 使用。
    const factoryNFT = new ethers.ContractFactory(abiNFT, bytecodeNFT, wallet);

    // 读取钱包内ETH余额
    const balanceETH = await provider.getBalance(wallet.address)
    // console.log(`钱包内ETH余额：${ethers.utils.formatEther(balanceETH)} ETH`)
    const balance = ethers.utils.formatEther(balanceETH)

    if(parseFloat(balance) > 0.002){
      // 4. 利用contractFactory部署NFT合约
      // ContractFactory.deploy() 的参数是合约构造函数的参数，这里是 name, symbol, signer 三个参数。
      const contractNFT = await factoryNFT.deploy("WTF Signature", "WTF", wallet.address)
      console.log(`合约地址: ${contractNFT.address}`);

      await contractNFT.deployTransaction.wait()

     

      // console.log(`GasUsed: ${JSON.stringify(receipt)}`);

      const msgHash = ethers.utils.solidityKeccak256(
        ['address', 'uint256'],
        [account, tokenId])
      console.log(`msgHash：${msgHash}`)
      const messageHashBytes = ethers.utils.arrayify(msgHash);
      
      const signature = await wallet.signMessage(messageHashBytes);
      console.log(`signature：${signature}`)

   

      // 5. 调用mint()函数，利用签名验证白名单，给account地址铸造NFT
      // console.log("\n3. 调用mint()函数，利用签名验证白名单，给第一个地址铸造NFT")
      console.log(`NFT名称: ${await contractNFT.name()}`)
      // console.log(`NFT代号: ${await contractNFT.symbol()}`)
      // let tx = await contractNFT.mint(account, tokenId, signature)
      // console.log("铸造中，等待交易上链")
      // await tx.wait()
      // console.log(`mint成功，地址${account} 的NFT余额: ${await contractNFT.balanceOf(account)}\n`)
  }
  }
  
  return (
    <div>
      <h3>签名</h3>
    </div>
  )
}
