import algosdk from "algosdk";
import MyAlgoConnect from "@randlabs/myalgo-connect";

export const ALGORAND_DECIMALS = 6;

// local (release) accounts
// Get mnemonics from existing accounts with ./sandbox goal account export --address [account_address]
//const localAccountMnemonic = "save ahead tired island slush caught medal tilt amused dream decade situate wear stuff flower mixture future car law must hungry dismiss ketchup abstract share"
const localAccountMnemonic = "prepare abstract silly doctor comfort shaft surge soda minimum document runway holiday aim thank usage correct people render advice inch level clump quick able salad"
export const localAccount = algosdk.mnemonicToSecretKey(localAccountMnemonic)

//export const ENVIRONMENT = "testnet"
export const ENVIRONMENT = "release"

const environment = {
    // Local private network
    release: {
        algodToken: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        algodServer: 'http://localhost',
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

export const currentRound = 21134500;

// https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0002.md
export const appNote = "marketplace-tutorial:uv1"

// declare application state storage (immutable)
export const localInts = 0;
export const localBytes = 0;
export const globalInts = 24; //# 4 for setup + 20 for choices. Use a larger number for more choices.
export const globalBytes = 3;