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
    "LittleProductTracking" : fs.readFileSync(contractBuildPath + 'LittleProductTracking.json', 'utf8'),
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

    const LegalEntityContract = await deployContract(input, "LegalEntity", []);
    const UserLoginContract = await deployContract(input, "UserLogin", []);
    const ProductFactory = await deployContract(input, "ProductFactory", []);
    const ProductHarvesterNode = await deployContract(input, "ProductHarvesterNode", []);
    const LittleProductTracking = await deployContract(input, "LittleProductTracking", []);

    // console.log("\nStart transfering ownership of VTAGTokenAdmin to veritag's address", veritagOwnerAddress);
    // tx = await sendTx(vTAGTokenAdminContract.methods.transferOwnership(veritagOwnerAddress));
    // console.log("Transfered ownership txHash", tx.transactionHash);

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