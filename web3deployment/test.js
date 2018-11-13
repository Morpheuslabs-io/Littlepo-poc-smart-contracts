
const Web3 = require("web3");
// const solc = require('solc');
const fs = require("fs");
const path = require('path');
const BigNumber = require('bignumber.js');
const config = require("./config.js")

const senderPK = "0xeaafe8a2221a1d023fe55fd9df3f6784ae91746863e279b9f7a286722cbc6d22";

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

    // gasLimit += 1000000;
    const tx = {
        from : txFrom,
        to : txTo,
        nonce : nonce,
        data : txData,
        gas : 5000000,
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

const Util = {};
Util.bytesToHex = function(byteArray) {
    let strNum = Util.toHexString(byteArray);
    let num = '0x' + strNum;
    return num;
};

Util.toHexString = function(byteArray) {
  return Array.from(byteArray, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
};

async function main() {
    console.log("Start transaction sender address", sender);
    nonce = await web3.eth.getTransactionCount(sender);
    console.log("Current nonce",nonce);

    chainId = chainId || await web3.eth.net.getId()
    console.log('chainId', chainId);


    await testHarvestNode();
    await testPackerNode();
    await testLittlepoNode();
    await testRetailShopNode();
}

async function testHarvestNode() {
    console.log("Test Create Product Batch for HarvestNode");
    const address = "0x7f67792c2534905E60e0CFA1c41b362c3F9907ed";
    const abi = [{"constant":false,"inputs":[{"name":"admin","type":"address"}],"name":"removeAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x1785f53c"},{"constant":true,"inputs":[],"name":"getOperators","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x27a099d8"},{"constant":true,"inputs":[],"name":"getAdmins","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x31ae450b"},{"constant":true,"inputs":[{"name":"_productBatchId","type":"bytes32"}],"name":"getProductBatchInfo","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x5445647d"},{"constant":true,"inputs":[],"name":"littlepoProductHistory","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x5599e55b"},{"constant":false,"inputs":[{"name":"newAdmin","type":"address"}],"name":"addAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x70480275"},{"constant":false,"inputs":[{"name":"_littlepoProductHistory","type":"address"}],"name":"setProductStorage","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x7a12b9c5"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x8da5cb5b"},{"constant":false,"inputs":[{"name":"newOperator","type":"address"}],"name":"addOperator","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x9870d7fe"},{"constant":false,"inputs":[{"name":"operator","type":"address"}],"name":"removeOperator","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xac8a584a"},{"constant":false,"inputs":[{"name":"_productBatchId","type":"bytes32"},{"name":"_childId","type":"bytes32"},{"name":"_childName","type":"bytes32"},{"name":"_childAddress","type":"address"}],"name":"addChild","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xc611a4d7"},{"constant":true,"inputs":[{"name":"_bBatchNo","type":"bytes32"}],"name":"getProductBatchByBatchNo","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xd977e6be"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xf2fde38b"},{"constant":true,"inputs":[],"name":"getNodeName","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"pure","type":"function","signature":"0xf7aca2cb"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newOperator","type":"address"},{"indexed":false,"name":"isAdd","type":"bool"}],"name":"OperatorAdded","type":"event","signature":"0x091a7a4b85135fdd7e8dbc18b12fabe5cc191ea867aa3c2e1a24a102af61d58b"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newAdmin","type":"address"},{"indexed":false,"name":"isAdd","type":"bool"}],"name":"AdminAdded","type":"event","signature":"0x8a7039f4ea6f86a6a98d9c1efb0ea9d190f6b3fa37c32627cf48f767f51e36d5"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event","signature":"0xf8df31144d9c2f0f6b59d69b8b98abd5459d07f2742c4df920b25aae33c64820"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event","signature":"0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0"},{"constant":false,"inputs":[{"name":"bArgs","type":"bytes32[]"}],"name":"createProductBatch","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x49334ee5"}];

    const contract = new web3.eth.Contract(abi, address);

    let bInputs = [];
    // let uInputs = [];

    bInputs.push(web3.utils.fromAscii("HarvestPDB01"));
    bInputs.push(web3.utils.fromAscii("HarvestPDB01"));
    bInputs.push(web3.utils.fromAscii("HarvestPDB01"));
    bInputs.push(web3.utils.fromAscii("HarvestPDB01"));
    bInputs.push(web3.utils.fromAscii("HarvestPDB01"));
    bInputs.push(web3.utils.fromAscii("HarvestPDB01"));
    bInputs.push(web3.utils.fromAscii("HarvestPDB01"));
    bInputs.push(web3.utils.fromAscii("HarvestPDB01"));
    bInputs.push(web3.utils.fromAscii("HarvestPDB01"));

    let tx = await sendTx(
        contract.methods.createProductBatch(
            bInputs
        )
    );

    console.log("Gas used", tx.gasUsed, "Txhash",tx.transactionHash);
}

async function testPackerNode() {
    console.log("Test Create Product Batch for PackerNode");
    const address = "0x246Bf0500DAb055DBB5D39891C36f3CFb81173A4";
    const abi = [{"constant":false,"inputs":[{"name":"admin","type":"address"}],"name":"removeAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x1785f53c"},{"constant":true,"inputs":[],"name":"getOperators","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x27a099d8"},{"constant":true,"inputs":[],"name":"getAdmins","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x31ae450b"},{"constant":true,"inputs":[{"name":"_productBatchId","type":"bytes32"}],"name":"getProductBatchInfo","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x5445647d"},{"constant":true,"inputs":[],"name":"littlepoProductHistory","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x5599e55b"},{"constant":false,"inputs":[{"name":"newAdmin","type":"address"}],"name":"addAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x70480275"},{"constant":false,"inputs":[{"name":"_littlepoProductHistory","type":"address"}],"name":"setProductStorage","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x7a12b9c5"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x8da5cb5b"},{"constant":false,"inputs":[{"name":"newOperator","type":"address"}],"name":"addOperator","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x9870d7fe"},{"constant":false,"inputs":[{"name":"operator","type":"address"}],"name":"removeOperator","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xac8a584a"},{"constant":false,"inputs":[{"name":"_productBatchId","type":"bytes32"},{"name":"_childId","type":"bytes32"},{"name":"_childName","type":"bytes32"},{"name":"_childAddress","type":"address"}],"name":"addChild","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xc611a4d7"},{"constant":true,"inputs":[{"name":"_bBatchNo","type":"bytes32"}],"name":"getProductBatchByBatchNo","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xd977e6be"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xf2fde38b"},{"constant":true,"inputs":[],"name":"getNodeName","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"pure","type":"function","signature":"0xf7aca2cb"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newOperator","type":"address"},{"indexed":false,"name":"isAdd","type":"bool"}],"name":"OperatorAdded","type":"event","signature":"0x091a7a4b85135fdd7e8dbc18b12fabe5cc191ea867aa3c2e1a24a102af61d58b"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newAdmin","type":"address"},{"indexed":false,"name":"isAdd","type":"bool"}],"name":"AdminAdded","type":"event","signature":"0x8a7039f4ea6f86a6a98d9c1efb0ea9d190f6b3fa37c32627cf48f767f51e36d5"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event","signature":"0xf8df31144d9c2f0f6b59d69b8b98abd5459d07f2742c4df920b25aae33c64820"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event","signature":"0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0"},{"constant":false,"inputs":[{"name":"bArgs","type":"bytes32[]"}],"name":"createProductBatch","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x49334ee5"}];

    const contract = new web3.eth.Contract(abi, address);

    let bInputs = [];
    // let uInputs = [];

    bInputs.push(web3.utils.fromAscii("HarvestPDB01"));
    bInputs.push(web3.utils.fromAscii("HarvestPDB01"));
    bInputs.push(web3.utils.fromAscii("HarvestPDB01"));
    bInputs.push(web3.utils.fromAscii("HarvestPDB01"));
    bInputs.push(web3.utils.fromAscii("HarvestPDB01"));
    bInputs.push(web3.utils.fromAscii("HarvestPDB01"));
    bInputs.push(web3.utils.fromAscii("HarvestPDB01"));
    bInputs.push(web3.utils.fromAscii("HarvestPDB01"));
    bInputs.push(web3.utils.fromAscii("HarvestPDB01"));
    bInputs.push(web3.utils.fromAscii("HarvestPDB01"));
    bInputs.push(web3.utils.fromAscii("HarvestPDB01"));

    let tx = await sendTx(
        contract.methods.createProductBatch(
            bInputs
        )
    );

    console.log("Gas used", tx.gasUsed, "Txhash",tx.transactionHash);
}

async function testLittlepoNode() {
    console.log("Test Create Product Batch for LittleNode");
    const address = "0xD27e60555424d1712c9348650D33Aa84A8b70B20";
    const abi = [{"constant":false,"inputs":[{"name":"admin","type":"address"}],"name":"removeAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x1785f53c"},{"constant":true,"inputs":[],"name":"getOperators","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x27a099d8"},{"constant":true,"inputs":[],"name":"getAdmins","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x31ae450b"},{"constant":true,"inputs":[{"name":"_productBatchId","type":"bytes32"}],"name":"getProductBatchInfo","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x5445647d"},{"constant":true,"inputs":[],"name":"littlepoProductHistory","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x5599e55b"},{"constant":false,"inputs":[{"name":"newAdmin","type":"address"}],"name":"addAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x70480275"},{"constant":false,"inputs":[{"name":"_littlepoProductHistory","type":"address"}],"name":"setProductStorage","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x7a12b9c5"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x8da5cb5b"},{"constant":false,"inputs":[{"name":"newOperator","type":"address"}],"name":"addOperator","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x9870d7fe"},{"constant":false,"inputs":[{"name":"operator","type":"address"}],"name":"removeOperator","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xac8a584a"},{"constant":false,"inputs":[{"name":"_productBatchId","type":"bytes32"},{"name":"_childId","type":"bytes32"},{"name":"_childName","type":"bytes32"},{"name":"_childAddress","type":"address"}],"name":"addChild","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xc611a4d7"},{"constant":true,"inputs":[{"name":"_bBatchNo","type":"bytes32"}],"name":"getProductBatchByBatchNo","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xd977e6be"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xf2fde38b"},{"constant":true,"inputs":[],"name":"getNodeName","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"pure","type":"function","signature":"0xf7aca2cb"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newOperator","type":"address"},{"indexed":false,"name":"isAdd","type":"bool"}],"name":"OperatorAdded","type":"event","signature":"0x091a7a4b85135fdd7e8dbc18b12fabe5cc191ea867aa3c2e1a24a102af61d58b"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newAdmin","type":"address"},{"indexed":false,"name":"isAdd","type":"bool"}],"name":"AdminAdded","type":"event","signature":"0x8a7039f4ea6f86a6a98d9c1efb0ea9d190f6b3fa37c32627cf48f767f51e36d5"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event","signature":"0xf8df31144d9c2f0f6b59d69b8b98abd5459d07f2742c4df920b25aae33c64820"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event","signature":"0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0"},{"constant":false,"inputs":[{"name":"bArgs","type":"bytes32[]"}],"name":"createProductBatch","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x49334ee5"}];

    const contract = new web3.eth.Contract(abi, address);

    let bInputs = [];
    // let uInputs = [];

    bInputs.push(web3.utils.fromAscii("HarvestPDB01"));
    bInputs.push(web3.utils.fromAscii("HarvestPDB01"));
    bInputs.push(web3.utils.fromAscii("HarvestPDB01"));
    bInputs.push(web3.utils.fromAscii("HarvestPDB01"));
    bInputs.push(web3.utils.fromAscii("HarvestPDB01"));
    bInputs.push(web3.utils.fromAscii("HarvestPDB01"));
    bInputs.push(web3.utils.fromAscii("HarvestPDB01"));
    bInputs.push(web3.utils.fromAscii("HarvestPDB01"));
    bInputs.push(web3.utils.fromAscii("HarvestPDB01"));
    bInputs.push(web3.utils.fromAscii("HarvestPDB01"));
    bInputs.push(web3.utils.fromAscii("HarvestPDB01"));

    let tx = await sendTx(
        contract.methods.createProductBatch(
            bInputs
        )
    );

    console.log("Gas used", tx.gasUsed, "Txhash",tx.transactionHash);
}

async function testRetailShopNode() {
    console.log("Test Create Product Batch for RetailShopNode");
    const address = "0x84397A488aC85C0322e5AA83E2ADAcA3153F56a6";
    const abi = [{"constant":false,"inputs":[{"name":"admin","type":"address"}],"name":"removeAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x1785f53c"},{"constant":true,"inputs":[],"name":"getOperators","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x27a099d8"},{"constant":true,"inputs":[],"name":"getAdmins","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x31ae450b"},{"constant":true,"inputs":[{"name":"_productBatchId","type":"bytes32"}],"name":"getProductBatchInfo","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x5445647d"},{"constant":true,"inputs":[],"name":"littlepoProductHistory","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x5599e55b"},{"constant":false,"inputs":[{"name":"newAdmin","type":"address"}],"name":"addAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x70480275"},{"constant":false,"inputs":[{"name":"_littlepoProductHistory","type":"address"}],"name":"setProductStorage","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x7a12b9c5"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x8da5cb5b"},{"constant":false,"inputs":[{"name":"newOperator","type":"address"}],"name":"addOperator","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x9870d7fe"},{"constant":false,"inputs":[{"name":"operator","type":"address"}],"name":"removeOperator","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xac8a584a"},{"constant":false,"inputs":[{"name":"_productBatchId","type":"bytes32"},{"name":"_childId","type":"bytes32"},{"name":"_childName","type":"bytes32"},{"name":"_childAddress","type":"address"}],"name":"addChild","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xc611a4d7"},{"constant":true,"inputs":[{"name":"_bBatchNo","type":"bytes32"}],"name":"getProductBatchByBatchNo","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xd977e6be"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xf2fde38b"},{"constant":true,"inputs":[],"name":"getNodeName","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"pure","type":"function","signature":"0xf7aca2cb"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newOperator","type":"address"},{"indexed":false,"name":"isAdd","type":"bool"}],"name":"OperatorAdded","type":"event","signature":"0x091a7a4b85135fdd7e8dbc18b12fabe5cc191ea867aa3c2e1a24a102af61d58b"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newAdmin","type":"address"},{"indexed":false,"name":"isAdd","type":"bool"}],"name":"AdminAdded","type":"event","signature":"0x8a7039f4ea6f86a6a98d9c1efb0ea9d190f6b3fa37c32627cf48f767f51e36d5"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event","signature":"0xf8df31144d9c2f0f6b59d69b8b98abd5459d07f2742c4df920b25aae33c64820"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event","signature":"0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0"},{"constant":false,"inputs":[{"name":"bArgs","type":"bytes32[]"}],"name":"createProductBatch","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x49334ee5"}];

    const contract = new web3.eth.Contract(abi, address);

    let bInputs = [];
    // let uInputs = [];

    bInputs.push(web3.utils.fromAscii("HarvestPDB01"));
    bInputs.push(web3.utils.fromAscii("HarvestPDB01"));
    bInputs.push(web3.utils.fromAscii("HarvestPDB01"));
    bInputs.push(web3.utils.fromAscii("HarvestPDB01"));
    bInputs.push(web3.utils.fromAscii("HarvestPDB01"));
    bInputs.push(web3.utils.fromAscii("HarvestPDB01"));
    bInputs.push(web3.utils.fromAscii("HarvestPDB01"));
    bInputs.push(web3.utils.fromAscii("HarvestPDB01"));
    bInputs.push(web3.utils.fromAscii("HarvestPDB01"));
    bInputs.push(web3.utils.fromAscii("HarvestPDB01"));
    bInputs.push(web3.utils.fromAscii("HarvestPDB01"));
    bInputs.push(web3.utils.fromAscii("HarvestPDB01"));
    bInputs.push(web3.utils.fromAscii("HarvestPDB01"));
    bInputs.push(web3.utils.fromAscii("HarvestPDB01"));

    let tx = await sendTx(
        contract.methods.createProductBatch(
            bInputs
        )
    );

    console.log("Gas used", tx.gasUsed, "Txhash",tx.transactionHash);
}

main();