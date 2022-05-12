import algosdk from "algosdk";
import MyAlgoConnect from "@randlabs/myalgo-connect";

// See README.md on how to create and start a local sandbox environment
//export const ENVIRONMENT = "localSandbox"
export const ENVIRONMENT = "testnet"

// local (release) account
// 1. Get mnemonics from existing accounts with ./sandbox goal account export --address [account_address]
// 2. Update .env.development with local account mnemonic
export const localAccount = algosdk.mnemonicToSecretKey(process.env.REACT_APP_LOCAL_ACCOUNT_MNEMONIC)

const apiEnvironment = {
    // Local private network
    // https://developer.algorand.org/docs/sdks/javascript/#connect-your-client
    localSandbox: {
        algodToken: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        algodServer: "http://localhost",
        algodPort: 4001,
        indexerToken: "",
        indexerServer: "http://localhost",
        indexerPort: 8980,
    },
    // Testnet
    testnet: {
        algodToken: "",
        algodServer: "https://node.testnet.algoexplorerapi.io",
        algodPort: "",
        indexerToken: "",
        indexerServer: "https://algoindexer.testnet.algoexplorerapi.io",
        indexerPort: "",
    }
}

const config = apiEnvironment[ENVIRONMENT]

export const algodClient = new algosdk.Algodv2(config.algodToken, config.algodServer, config.algodPort)

export const indexerClient = new algosdk.Indexer(config.indexerToken, config.indexerServer, config.indexerPort);

export const myAlgoConnect = new MyAlgoConnect();

export const minRound = 21540981;

// https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0002.md
export const marketplaceNote = "tutorial-marketplace:uv1"

// Maximum local storage allocation, immutable
export const numLocalInts = 0;
export const numLocalBytes = 0;
// Maximum global storage allocation, immutable
export const numGlobalInts = 2; // Global variables stored as Int: count, sold
export const numGlobalBytes = 3; // Global variables stored as Bytes: name, description, image

export const ALGORAND_DECIMALS = 6;