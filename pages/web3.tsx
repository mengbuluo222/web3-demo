import {
  Address,
  ConnectButton,
  Connector,
  NFTCard,
  useAccount,
} from "@ant-design/web3";
import { MetaMask, WagmiWeb3ConfigProvider, Hardhat, Sepolia, Polygon, WalletConnect } from "@ant-design/web3-wagmi";
import { Button, message } from "antd";
import { parseEther } from "viem";
import {
  createConfig,
  http,
  useReadContract,
  useWriteContract,
  useWatchContractEvent,
} from "wagmi";
import { mainnet, sepolia, polygon, hardhat } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

const config = createConfig({
  chains: [mainnet, sepolia, polygon, hardhat],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [hardhat.id]: http("http://127.0.0.1:8545/"),
  },
  connectors: [
    injected({
      target: "metaMask",
    }),
    walletConnect({
      projectId: "c07c0051c2055890eade3556618e38a6",
      showQrModal: false,
    }),
  ],
});

const CallTest = () => {
  const { account } = useAccount();
  const result = useReadContract({
    abi: [
      {
        type: "function",
        name: "balanceOf",
        stateMutability: "view",
        inputs: [{ name: "account", type: "address" }],
        outputs: [{ type: "uint256" }],
      },
    ],
    // Sepolia test contract 0x418325c3979b7f8a17678ec2463a74355bdbe72c
    address: "0xEcd0D12E21805803f70de03B72B1C162dB0898d9",
    functionName: "balanceOf",
    args: [account?.address as `0x${string}`],
  });
  const { writeContract } = useWriteContract();

  const contractInfo = [
    {
      id: 1,
      name: "Ethereum",
      contractAddress: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    },
    {
      id: 5,
      name: "Sepolia",
      contractAddress: "0x418325c3979b7f8a17678ec2463a74355bdbe72c",
    },
    {
      id: 137,
      name: "Polygon",
      contractAddress: "0x418325c3979b7f8a17678ec2463a74355bdbe72c",
    },
    {
      id: hardhat.id,
      name: "Hardhat",
       contractAddress: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    }
  ];

  useWatchContractEvent({
    address: "0xEcd0D12E21805803f70de03B72B1C162dB0898d9",
    abi: [
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "address",
            name: "minter",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "Minted",
        type: "event",
      },
    ],
    eventName: "Minted",
    onLogs() {
      message.success("new minted!");
    },
  });

  return (
    <div>
      {result.data?.toString()}
      <Button
        onClick={() => {
          writeContract(
            {
              abi: [
                {
                  type: "function",
                  name: "mint",
                  stateMutability: "payable",
                  inputs: [
                    {
                      internalType: "uint256",
                      name: "quantity",
                      type: "uint256",
                    },
                  ],
                  outputs: [],
                },
              ],
              address: "0xEcd0D12E21805803f70de03B72B1C162dB0898d9",
              functionName: "mint",
              args: [1],
              value: parseEther("0.01"),
            },
            {
              onSuccess: () => {
                message.success("Mint Success");
              },
              onError: (err) => {
                message.error(err.message);
              },
            }
          );
        }}
      >
        mint
      </Button>
    </div>
  );
};

export default function Web3() {
  return (
    <WagmiWeb3ConfigProvider 
      config={config} 
      wallets={[MetaMask(), WalletConnect()]}
      eip6963={{
        autoAddInjectedWallets: true,
      }}
      chains={[mainnet, sepolia, polygon, hardhat]}
    >
      <Address format address="0xEcd0D12E21805803f70de03B72B1C162dB0898d9" />
      <Connector>
        <ConnectButton />
      </Connector>
      <CallTest />
    </WagmiWeb3ConfigProvider>
  );
}