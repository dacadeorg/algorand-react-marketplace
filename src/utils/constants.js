import algosdk from "algosdk";
import MyAlgoConnect from "@randlabs/myalgo-connect";

export const ALGORAND_DECIMALS = 6;

// local (release) account
// 1. Get mnemonics from existing accounts with ./sandbox goal account export --address [account_address]
// 2. Update .env.development with local account mnemonic
export const localAccount = algosdk.mnemonicToSecretKey(process.env.REACT_APP_LOCAL_ACCOUNT_MNEMONIC)

//export const ENVIRONMENT = "testnet"
export const ENVIRONMENT = "release"

const environment = {
    // Local private network
    release: {
        algodToken: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        algodServer: "http://localhost",
        algodPort: 4001,
        indexerToken: "",
        indexerServer: "http://localhost",
        indexerPort: 8980,
    },
    // Testnet using purestake API
    testnet: {
        algodToken: {
            "X-API-Key": "nUNvDv87ov6WwXYAXCtouVXQ568FJoG7MeRpSKD7",
        },
        algodServer: "https://testnet-algorand.api.purestake.io/ps2",
        algodPort: "",
        indexerToken: "",
        indexerServer: "https://algoindexer.testnet.algoexplorerapi.io",
        indexerPort: "",
    }
}

const config = environment[ENVIRONMENT]

export const algodClient = new algosdk.Algodv2(config.algodToken, config.algodServer, config.algodPort)

export const indexerClient = new algosdk.Indexer(config.indexerToken, config.indexerServer, config.indexerPort);

export const myAlgoConnect = new MyAlgoConnect();

export const currentRound = 21231700;

// https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0002.md
export const appNote = "marketplace-tutorial:uv1"

// Maximum local storage allocation, immutable
export const numLocalInts = 0;
export const numLocalBytes = 0;
// Maximum global storage allocation, immutable
export const numGlobalInts = 2;
export const numGlobalBytes = 3;