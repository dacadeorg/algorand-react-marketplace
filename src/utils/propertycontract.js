import algosdk from "algosdk";
import {
  algodClient,
  indexerClient,
  minRound,
  myAlgoConnect,
  numGlobalBytes,
  numGlobalInts,
  numLocalBytes,
  numLocalInts,
  propertyDappNote,
} from "./constants";
/* eslint import/no-webpack-loader-syntax: off */
import approvalProgram from "!!raw-loader!../contracts/property_contract_approval.teal";
import clearProgram from "!!raw-loader!../contracts/property_contract_clear.teal";
import { base64ToUTF8String, utf8ToBase64String } from "./conversions";

class Property {
  constructor(
    title,
    image,
    location,
    price,
    bought,
    rate,
    buyer,
    appId,
    owner
  ) {
    this.title = title;
    this.image = image;
    this.location = location;
    this.price = price;
    this.bought = bought;
    this.rate = rate;
    this.buyer = buyer;
    this.appId = appId;
    this.owner = owner;
  }
}

// Compile smart contract in .teal format to program
const compileProgram = async (programSource) => {
  let encoder = new TextEncoder();
  let programBytes = encoder.encode(programSource);
  let compileResponse = await algodClient.compile(programBytes).do();
  return new Uint8Array(Buffer.from(compileResponse.result, "base64"));
};

// CREATE PRODUCT: ApplicationCreateTxn
export const createPropertyAction = async (senderAddress, property) => {
  

  let params = await algodClient.getTransactionParams().do();

  // Compile programs
  const compiledApprovalProgram = await compileProgram(approvalProgram);
  const compiledClearProgram = await compileProgram(clearProgram);

  // Build note to identify transaction later and required app args as Uint8Arrays
  let note = new TextEncoder().encode(propertyDappNote);
  let title = new TextEncoder().encode(property.title);
  let image = new TextEncoder().encode(property.image);
  let location = new TextEncoder().encode(property.location);
  let price = algosdk.encodeUint64(property.price);
  let owner = new TextEncoder().encode(senderAddress);

  let appArgs = [title, image, location, owner, price];

  // Create ApplicationCreateTxn
  let txn = algosdk.makeApplicationCreateTxnFromObject({
    from: senderAddress,
    suggestedParams: params,
    onComplete: algosdk.OnApplicationComplete.NoOpOC,
    approvalProgram: compiledApprovalProgram,
    clearProgram: compiledClearProgram,
    numLocalInts: numLocalInts,
    numLocalByteSlices: numLocalBytes,
    numGlobalInts: numGlobalInts,
    numGlobalByteSlices: numGlobalBytes,
    note: note,
    appArgs: appArgs,
  });

  // Get transaction ID
  let txId = txn.txID().toString();

  // Sign & submit the transaction
  let signedTxn = await myAlgoConnect.signTransaction(txn.toByte());
  
  await algodClient.sendRawTransaction(signedTxn.blob).do();

  // Wait for transaction to be confirmed
  let confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4);

  // Get the completed Transaction
  

  // Get created application id and notify about completion
  let transactionResponse = await algodClient
    .pendingTransactionInformation(txId)
    .do();
  let appId = transactionResponse["application-index"];
  
  return appId;
};

// BUY PRODUCT: Group transaction consisting of ApplicationCallTxn and PaymentTxn
export const buyPropertyAction = async (senderAddress, product) => {
  

  let params = await algodClient.getTransactionParams().do();

  // Build required app args as Uint8Array
  let buyArg = new TextEncoder().encode("buy");
  let buyer = new TextEncoder().encode(senderAddress);
  let appArgs = [buyArg, buyer];

  // Create ApplicationCallTxn
  let appCallTxn = algosdk.makeApplicationCallTxnFromObject({
    from: senderAddress,
    appIndex: product.appId,
    onComplete: algosdk.OnApplicationComplete.NoOpOC,
    suggestedParams: params,
    appArgs: appArgs,
  });

  // Create PaymentTxn
  let paymentTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: senderAddress,
    to: product.owner,
    amount: product.price,
    suggestedParams: params,
  });

  let txnArray = [appCallTxn, paymentTxn];

  // Create group transaction out of previously build transactions
  let groupID = algosdk.computeGroupID(txnArray);
  for (let i = 0; i < 2; i++) txnArray[i].group = groupID;

  // Sign & submit the group transaction
  let signedTxn = await myAlgoConnect.signTransaction(
    txnArray.map((txn) => txn.toByte())
  );
  
  let tx = await algodClient
    .sendRawTransaction(signedTxn.map((txn) => txn.blob))
    .do();

  // Wait for group transaction to be confirmed
  let confirmedTxn = await algosdk.waitForConfirmation(algodClient, tx.txId, 4);

  // Notify about completion
  
};

// RATE PRODUCT: Group transaction consisting of ApplicationCallTxn and PaymentTxn
export const ratePropertyAction = async (senderAddress, product, rate) => {
  

  let params = await algodClient.getTransactionParams().do();

  // Build required app args as Uint8Array
  let rateArg = new TextEncoder().encode("rate");
  let ratesArg = algosdk.encodeUint64(rate);

  let appArgs = [rateArg, ratesArg];

  // Create ApplicationCallTxn
  let appCallTxn = algosdk.makeApplicationCallTxnFromObject({
    from: senderAddress,
    appIndex: product.appId,
    onComplete: algosdk.OnApplicationComplete.NoOpOC,
    suggestedParams: params,
    appArgs: appArgs,
  });

  let txnArray = [appCallTxn];

  // Create group transaction out of previously build transactions
  let groupID = algosdk.computeGroupID(txnArray);
  for (let i = 0; i < 1; i++) txnArray[i].group = groupID;

  // Sign & submit the group transaction
  let signedTxn = await myAlgoConnect.signTransaction(
    txnArray.map((txn) => txn.toByte())
  );
  
  let tx = await algodClient
    .sendRawTransaction(signedTxn.map((txn) => txn.blob))
    .do();

  // Wait for group transaction to be confirmed
  let confirmedTxn = await algosdk.waitForConfirmation(algodClient, tx.txId, 4);

  // Notify about completion
  
};

// DELETE PRODUCT: ApplicationDeleteTxn
export const deletePropertyAction = async (senderAddress, index) => {
  

  let params = await algodClient.getTransactionParams().do();

  // Create ApplicationDeleteTxn
  let txn = algosdk.makeApplicationDeleteTxnFromObject({
    from: senderAddress,
    suggestedParams: params,
    appIndex: index,
  });

  // Get transaction ID
  let txId = txn.txID().toString();

  // Sign & submit the transaction
  let signedTxn = await myAlgoConnect.signTransaction(txn.toByte());
  
  await algodClient.sendRawTransaction(signedTxn.blob).do();

  // Wait for transaction to be confirmed
  const confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4);

  // Get the completed Transaction
  

  // Get application id of deleted application and notify about completion
  let transactionResponse = await algodClient
    .pendingTransactionInformation(txId)
    .do();
  let appId = transactionResponse["txn"]["txn"].apid;
  
};

// GET PROPERTIES: Use indexer
export const getPropertiesAction = async () => {
  
  let note = new TextEncoder().encode(propertyDappNote);
  let encodedNote = Buffer.from(note).toString("base64");

  // Step 1: Get all transactions by notePrefix (+ minRound filter for performance)
  let transactionInfo = await indexerClient
    .searchForTransactions()
    .notePrefix(encodedNote)
    .txType("appl")
    .minRound(minRound)
    .do();
  let properties = [];
  for (const transaction of transactionInfo.transactions) {
    let appId = transaction["created-application-index"];
    if (appId) {
      // Step 2: Get each application by application id
      let property = await getApplication(appId);
      if (property) {
        properties.push(property);
      }
    }
  }
  
  return properties;
};

const getApplication = async (appId) => {
  try {
    // 1. Get application by appId
    let response = await indexerClient
      .lookupApplications(appId)
      .includeAll(true)
      .do();
    if (response.application.deleted) {
      return null;
    }
    let globalState = response.application.params["global-state"];

    // 2. Parse fields of response and return product
    let owner = response.application.params.creator;
    let title = "";
    let image = "";
    let location = "";
    let buyer = "";
    let price = 0;
    let rate = 0;
    let bought = 0;

    const getField = (fieldName, globalState) => {
      return globalState.find((state) => {
        return state.key === utf8ToBase64String(fieldName);
      });
    };

    if (getField("TITLE", globalState) !== undefined) {
      let field = getField("TITLE", globalState).value.bytes;
      title = base64ToUTF8String(field);
    }

    if (getField("IMAGE", globalState) !== undefined) {
      let field = getField("IMAGE", globalState).value.bytes;
      image = base64ToUTF8String(field);
    }

    if (getField("LOCATION", globalState) !== undefined) {
      let field = getField("LOCATION", globalState).value.bytes;
      location = base64ToUTF8String(field);
    }

    if (getField("PRICE", globalState) !== undefined) {
      price = getField("PRICE", globalState).value.uint;
    }

    if (getField("BOUGHT", globalState) !== undefined) {
      bought = getField("BOUGHT", globalState).value.uint;
    }

    if (getField("RATE", globalState) !== undefined) {
      rate = getField("RATE", globalState).value.uint;
    }

    if (getField("BUYER", globalState) !== undefined) {
      let field = getField("BUYER", globalState).value.bytes;
      buyer = base64ToUTF8String(field);
    }

    return new Property(
      title,
      image,
      location,
      price,
      bought,
      rate,
      buyer,
      appId,
      owner
    );
  } catch (err) {
    return null;
  }
};
