import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-solhint";
import "@nomiclabs/hardhat-waffle";
import { config as dotenvConfig } from "dotenv";
import "hardhat-contract-sizer";
import "hardhat-docgen";
import "hardhat-gas-reporter";
import "hardhat-preprocessor";
import "hardhat-deploy";
import "hardhat-deploy-ethers";

import { removeConsoleLog } from "hardhat-preprocessor";
import "hardhat-prettier";
import "hardhat-typechain";
import { HardhatUserConfig } from "hardhat/config";
import { NetworkUserConfig } from "hardhat/types";
import { resolve } from "path";
import "solidity-coverage";

// This is done to have the new matchers from waffle,
// because despite the note in https://hardhat.org/guides/waffle-testing.html?#adapting-the-tests
// the changeEtherBalance is not added because its a newer version
import chai from "chai";
import { solidity } from "ethereum-waffle";
chai.use(solidity);

dotenvConfig({ path: resolve(__dirname, "./.env") });

const chainIds = {
  ganache: 1337,
  goerli: 5,
  hardhat: 31337,
  kovan: 42,
  mainnet: 1,
  rinkeby: 4,
  ropsten: 3,
};

// Ensure that we have all the environment variables we need.
let mnemonic: string;
if (!process.env.MNEMONIC) {
  throw new Error("Please set your MNEMONIC in a .env file");
} else {
  mnemonic = process.env.MNEMONIC;
}

let infuraApiKey: string;
if (!process.env.INFURA_API_KEY) {
  throw new Error("Please set your INFURA_API_KEY in a .env file");
} else {
  infuraApiKey = process.env.INFURA_API_KEY;
}

const createTestnetConfig = (network: keyof typeof chainIds): NetworkUserConfig => {
  const url: string = "https://" + network + ".infura.io/v3/" + infuraApiKey;
  return {
    accounts: {
      count: 10,
      initialIndex: 0,
      mnemonic,
      path: "m/44'/60'/0'/0",
    },
    chainId: chainIds[network],
    url,
  };
};

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  namedAccounts: {
    deployer: 0,
  },
  networks: {
    goerli: createTestnetConfig("goerli"),
    kovan: createTestnetConfig("kovan"),
    rinkeby: createTestnetConfig("rinkeby"),
    ropsten: createTestnetConfig("ropsten"),
    hardhat: {
      from: "0x935e13d6e744da2f7f84d4348299367d6cce00d8",
      accounts:[{
        privateKey: "0x48bc56a0196d9090a6fae0fd426531da067879c1e4b452f0b97354b73562b942",
        balance: "10000000000000000000000"
      },
      {
        privateKey: "0xc2f3179baaa162ec9a45b18c52b82c8069a361d38e5c00134187695c3194fe01",
        balance: "10000000000000000000000"
      },{
        privateKey: "0x855a8450458871681bf9e7ec7af93aad89b5f49174d4ef549f104a541035ccd7",
        balance: "10000000000000000000000"
      },{
        privateKey: "0xffff2fe38b4a018b9d6d18d4a13f4eccd53ed874ca97a8ce6aadec5619aac787",
        balance: "10000000000000000000000"
      },{balance: '10000000000000000000000',
      privateKey: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff8"},
      {balance: '10000000000000000000000',
      privateKey: "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690"},
      {balance: '10000000000000000000000',
      privateKey: "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365"},
      {balance: '10000000000000000000000',
      privateKey: "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a"},
      {balance: '10000000000000000000000',
      privateKey: "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926"},
      {balance: '10000000000000000000000',
      privateKey: "0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffb"},
      {balance: '10000000000000000000000',
      privateKey: "0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564"},
      {balance: '10000000000000000000000',
      privateKey: "0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf435"},
      {balance: '10000000000000000000000',
      privateKey: "0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b9"},
      {balance: '10000000000000000000000',
      privateKey: "0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c"},
      {balance: '10000000000000000000000',
      privateKey: "0xf214f2b2cd398c806f84e317254e0f0b801d0643303237d97a22a48e0162889"},
      {balance: '10000000000000000000000',
      privateKey: "0x701b615bbdfb9de65240bc28bd21bbc0d996645a3dd57e7b12bc2bdf6f192c8"},
      {balance: '10000000000000000000000',
      privateKey: "0xa267530f49f8280200edf313ee7af6b827f2a8bce2897751d06a843f644967b"},
      {balance: '10000000000000000000000',
      privateKey: "0x47c99abed3324a2707c28affff1267e45918ec8c3f20b8aa892e8b065d2942d"},
      {balance: '10000000000000000000000',
      privateKey: "0xc526ee95bf44d8fc405a158bb884d9d1238d99f0612e9f33d006bb0789009aa"},
      {balance: '10000000000000000000000',
      privateKey: "0x8166f546bab6da521a8369cab06c5d2b9e46670292d85c875ee9ec20e84ffb6"},
      {balance: '10000000000000000000000',
      privateKey: "0xea6c44ac03bff858b476bba40716402b03e41b8e97e276d1baec7c37d42484a"},
      {balance: '10000000000000000000000',
      privateKey: "0x689af8efa8c651a91ad287602527f3af2fe9f6501a7ac4b061667b5a93e037f"},
      {balance: '10000000000000000000000',
      privateKey: "0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee"},
      {balance: '10000000000000000000000',
      privateKey: "0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656"}]
    }
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    version: "0.7.4",
    settings: {
      // https://hardhat.org/hardhat-network/#solidity-optimizer-support
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS ? true : false,
    currency: "USD",
    gasPrice: 21,
  },
  preprocess: {
    eachLine: removeConsoleLog(hre => !["hardhat", "localhost"].includes(hre.network.name)),
  },
  docgen: {
    path: "./docs",
    clear: true,
    runOnCompile: false,
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },
};

export default config;
