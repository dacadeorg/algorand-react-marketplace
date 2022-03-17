import algosdk from "algosdk";


const mainNetClient = new algosdk.Algodv2("", "https://algoexplorerapi.io", "");
const testNetClient = new algosdk.Algodv2("", "https://testnet.algoexplorerapi.io", "");

function clientForChain(chain) {
    switch (chain) {
        case "mainnet":
            return mainNetClient;
        case "testnet":
            return testNetClient;
        default:
            throw new Error(`Unknown chain type: ${chain}`);
    }
}

export async function apiGetAccountAssets(
    chain,
    address,
) {
    const client = clientForChain(chain);

    const accountInfo = await client
        .accountInformation(address)
        .setIntDecoding(algosdk.IntDecoding.BIGINT)
        .do();

    const algoBalance = accountInfo.amount;
    const assetsFromRes = accountInfo.assets;

    const assets = assetsFromRes.map(({ "asset-id": id, amount, creator, frozen }) => ({
        id: Number(id),
        amount,
        creator,
        frozen,
        decimals: 0,
    }));

    assets.sort((a, b) => a.id - b.id);

    await Promise.all(
        assets.map(async asset => {
            const { params } = await client.getAssetByID(asset.id).do();
            asset.name = params.name;
            asset.unitName = params["unit-name"];
            asset.url = params.url;
            asset.decimals = params.decimals;
        }),
    );

    assets.unshift({
        id: 0,
        amount: algoBalance,
        creator: "",
        frozen: false,
        decimals: 6,
        name: "Algo",
        unitName: "Algo",
    });

    return assets;
}

export async function apiGetTxnParams(chain){
    const params = await clientForChain(chain)
        .getTransactionParams()
        .do();
    return params;
}

export async function apiSubmitTransactions(
    chain,
    stxns,
){
    const { txId } = await clientForChain(chain)
        .sendRawTransaction(stxns)
        .do();
    return await waitForTransaction(chain, txId);
}

async function waitForTransaction(chain, txId) {
    const client = clientForChain(chain);

    let lastStatus = await client.status().do();
    let lastRound = lastStatus["last-round"];
    while (true) {
        const status = await client.pendingTransactionInformation(txId).do();
        if (status["pool-error"]) {
            throw new Error(`Transaction Pool Error: ${status["pool-error"]}`);
        }
        if (status["confirmed-round"]) {
            return status["confirmed-round"];
        }
        lastStatus = await client.statusAfterBlock(lastRound + 1).do();
        lastRound = lastStatus["last-round"];
    }
}



// export const fetchAssets = async (account) => {
//     try {
//         let assetsData = [];
//
//
//         // @ts-ignore
//         const accountData = await algod({
//             ledger: "TestNet",
//             path: `/v2/accounts/${account}`,
//         });
//
//         console.log(accountData)
//           await accountData.assets.reduce(
//             (promise, asset) =>
//               promise.then(() =>
//                 AlgoSigner.indexer({
//                   ledger: "TestNet",
//                   path: `/v2/assets/${asset["asset-id"]}`,
//                 }).then((d) => assetsData.push(d))
//               ),
//             Promise.resolve()
//           );
//
//         return assetsData;
//     } catch (e) {
//
//     }
// };
