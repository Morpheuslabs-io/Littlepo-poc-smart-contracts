#!/usr/bin/env node

const Web3 = require("web3");
// const solc = require('solc');
const fs = require("fs");
const path = require('path');
const BigNumber = require('bignumber.js');
const config = require("./config.js")

const senderPK = config.ownerPrivateKey;

const rpcUrl = config.network;
const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));

// config sender;
const gasPrice =  config.gasPrice * (10 ** 9);

const account = web3.eth.accounts.privateKeyToAccount(senderPK);
const sender = account.address;
const signedTxs = [];
let dontSendTx = false;
let nonce;
let chainId = 0;

async function sendTx(txObject) {
    const txTo = txObject._parent.options.address;

    let gasLimit;
    try {
        gasLimit = await txObject.estimateGas();
        console.log("Estimated gas", gasLimit);
    }
    catch (e) {
        gasLimit = 500 * 1000;
    }

    if(txTo !== null) {
        gasLimit = 500 * 1000;
    }

    const txData = txObject.encodeABI();
    const txFrom = account.address;
    const txKey = account.privateKey;

    gasLimit += 50000;
    const tx = {
        from : txFrom,
        to : txTo,
        nonce : nonce,
        data : txData,
        gas : gasLimit,
        chainId,
        gasPrice
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, txKey);
    nonce++;
    // don't wait for confirmation
    signedTxs.push(signedTx.rawTransaction)
    let txHash = await web3.eth.sendSignedTransaction(signedTx.rawTransaction, {from:sender});

    return txHash;
}

async function deployContract(input, contractName, ctorArgs) {
    const source = input[contractName];
    const contractSource = JSON.parse(source);
    const abi = contractSource.abi;
    const bytecode = contractSource.bytecode;
    let contract = new web3.eth.Contract(abi);
    const deploy = contract.deploy({data: bytecode, arguments: ctorArgs});

    console.log(`\nDeploying contract ${contractName}, please wait for network to mine`);
    let tx = await sendTx(deploy);
    contract = new web3.eth.Contract(abi,tx.contractAddress);
    // contract.options.address = tx.contractAddress;
    console.log("Deployed contract", contractName, "address", tx.contractAddress);
    console.log("ABI ", JSON.stringify(abi).replace(/\s+/g, ''));
    return contract;
}

const contractBuildPath = path.join(__dirname, "../build/contracts/");

const input = {
    "LegalEntity" : fs.readFileSync(contractBuildPath + 'LegalEntity.json', 'utf8'),
    "UserLogin" : fs.readFileSync(contractBuildPath + 'UserLogin.json', 'utf8'),
    "ProductFactory" : fs.readFileSync(contractBuildPath + 'ProductFactory.json', 'utf8'),
    "ProductHarvesterNode" : fs.readFileSync(contractBuildPath + 'ProductHarvesterNode.json', 'utf8'),
    "ProductPackerNode" : fs.readFileSync(contractBuildPath + 'ProductPackerNode.json', 'utf8'),
    "LittlepoNode" : fs.readFileSync(contractBuildPath + 'LittlepoNode.json', 'utf8'),
    "RetailShopNode" : fs.readFileSync(contractBuildPath + 'RetailShopNode.json', 'utf8'),
    "LittlepoProductHistory" : fs.readFileSync(contractBuildPath + 'LittlepoProductHistory.json', 'utf8'),
    "LittlepoProductTracking" : fs.readFileSync(contractBuildPath + 'LittlepoProductTracking.json', 'utf8'),
};

// deployment process
// 1. deploy nodes
// 2. deploy proxy 
// 3. add admin/operator for nodes
// 4. add admin for proxy
// 5. add 
async function main() {

    console.log("Start deployment use address", sender);
    nonce = await web3.eth.getTransactionCount(sender);
    console.log("Current nonce",nonce);

    chainId = chainId || await web3.eth.net.getId()
    console.log('chainId', chainId);

    if (!dontSendTx) {
        await waitForEth();
    }

    const legalEntityContract = await deployContract(input, "LegalEntity", []);
    const userLoginContract = await deployContract(input, "UserLogin", []);
    const productFactoryContract = await deployContract(input, "ProductFactory", []);
    const productHarvesterNodeContract = await deployContract(input, "ProductHarvesterNode", []);
    const productPackerNodeContract = await deployContract(input, "ProductPackerNode", []);
    const littlepoNodeContract = await deployContract(input, "LittlepoNode", []);
    const retailShopNodeContract = await deployContract(input, "RetailShopNode", []);
    const littlepoProductHistoryContract = await deployContract(input, "LittlepoProductHistory", []);
    const littlepoProductTrackingContract = await deployContract(input, "LittlepoProductTracking", []);

    //tracking
    let tx;
    //registerHistory
    tx = await sendTx(littlepoProductTrackingContract.methods.registerHistory(littlepoProductHistoryContract.options.address));
    console.log("==> registerHistory", tx.transactionHash);
    //registerProductFactory
    tx = await sendTx(littlepoProductTrackingContract.methods.registerProductFactory(productFactoryContract.options.address));
    console.log("==> registerProductFactory", tx.transactionHash);

    //littlepoProductHistoryContract
    // registerNode
    let nodeName = await productHarvesterNodeContract.methods.getNodeName().call();
    console.log("==> Node name", web3.utils.toAscii(nodeName));

    tx = await sendTx(littlepoProductHistoryContract.methods.registerNode(nodeName, productHarvesterNodeContract.options.address));
    console.log("==> register ProductHarvest node", tx.transactionHash);

    nodeName = await productPackerNodeContract.methods.getNodeName().call();
    console.log("==> Node name", web3.utils.toAscii(nodeName));

    tx = await sendTx(littlepoProductHistoryContract.methods.registerNode(nodeName, productPackerNodeContract.options.address));
    console.log("==> register Packer node", tx.transactionHash);

    nodeName = await littlepoNodeContract.methods.getNodeName().call();
    console.log("==> Node name", web3.utils.toAscii(nodeName));

    tx = await sendTx(littlepoProductHistoryContract.methods.registerNode(nodeName, littlepoNodeContract.options.address));
    console.log("==> register Littpo Node", tx.transactionHash);

    nodeName = await retailShopNodeContract.methods.getNodeName().call();
    console.log("==> Node name", web3.utils.toAscii(nodeName));

    tx = await sendTx(littlepoProductHistoryContract.methods.registerNode(nodeName, retailShopNodeContract.options.address));
    console.log("==> register Littpo Node", tx.transactionHash);
    
    //node
    //setProductStorage
    tx = await sendTx(productHarvesterNodeContract.methods.setProductStorage(littlepoProductHistoryContract.options.address));
    console.log("setProductStorage", tx.transactionHash);

    tx = await sendTx(productPackerNodeContract.methods.setProductStorage(littlepoProductHistoryContract.options.address));
    console.log("setProductStorage", tx.transactionHash);

    tx = await sendTx(littlepoNodeContract.methods.setProductStorage(littlepoProductHistoryContract.options.address));
    console.log("setProductStorage", tx.transactionHash);

    tx = await sendTx(retailShopNodeContract.methods.setProductStorage(littlepoProductHistoryContract.options.address));
    console.log("setProductStorage", tx.transactionHash);

    console.log("Finished deployment")
}

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

async function waitForEth() {
    while(true) {
        const balance = await web3.eth.getBalance(sender);
        console.log("waiting for balance to account " + sender);
        if(balance.toString() !== "0") {
            console.log("received " + balance.toString() + " wei");
            return;
        }
        else await sleep(10000)
    }
}

main();