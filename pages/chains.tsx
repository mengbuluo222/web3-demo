import { ConnectButton, Connector } from '@ant-design/web3';
import {
  Hardhat,
  Localhost,
  Mainnet,
  MetaMask,
  Polygon,
  WagmiWeb3ConfigProvider,
  WalletConnect,
  X1Testnet,
} from '@ant-design/web3-wagmi';
import { http, createConfig } from 'wagmi';
import { mainnet, sepolia, polygon, hardhat } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

const config = createConfig({
  chains: [mainnet, sepolia, polygon, hardhat],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [hardhat.id]: http("http://127.0.0.1:8545/")
  },
  connectors: [
    injected({
      target: "metaMask",
    }),
    walletConnect({
      projectId: "c07c0051c2055890eade3556618e38a6",
      showQrModal: false,
    })
  ],
});

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

const App: React.FC = () => {
  return (
    <WagmiWeb3ConfigProvider
      config={config}
      walletConnect={{
        projectId: 'c07c0051c2055890eade3556618e38a6',
      }}
      eip6963
      wallets={[MetaMask(), WalletConnect()]}
      chains={[Mainnet, Polygon, X1Testnet, Hardhat, Localhost]}
    >
      <Connector>
        <ConnectButton />
      </Connector>
    </WagmiWeb3ConfigProvider>
  );
};

export default App;