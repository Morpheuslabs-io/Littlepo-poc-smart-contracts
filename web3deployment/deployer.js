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
        gasLimit = 5000 * 1000;
    }

    if(txTo !== null) {
        gasLimit = 5000 * 1000;
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
    console.log("registerHistory", tx.transactionHash);
    //registerProductFactory
    tx = await sendTx(littlepoProductTrackingContract.methods.registerProductFactory(productFactoryContract.options.address));
    console.log("registerProductFactory", tx.transactionHash);

    //littlepoProductHistoryContract
    // registerNode
    let nodeName = await productHarvesterNodeContract.methods.getNodeName().call();
    console.log("Node name", web3.utils.toAscii(nodeName));

    tx = await sendTx(littlepoProductHistoryContract.methods.registerNode(nodeName, productHarvesterNodeContract.options.address));
    console.log("register ProductHarvest node", tx.transactionHash);

    nodeName = await productPackerNodeContract.methods.getNodeName().call();
    console.log("Node name", web3.utils.toAscii(nodeName));

    tx = await sendTx(littlepoProductHistoryContract.methods.registerNode(nodeName, productPackerNodeContract.options.address));
    console.log("register Packer node", tx.transactionHash);

    nodeName = await littlepoNodeContract.methods.getNodeName().call();
    console.log("Node name", web3.utils.toAscii(nodeName));

    tx = await sendTx(littlepoProductHistoryContract.methods.registerNode(nodeName, littlepoNodeContract.options.address));
    console.log("register Littpo Node", tx.transactionHash);

    nodeName = await retailShopNodeContract.methods.getNodeName().call();
    console.log("Node name", web3.utils.toAscii(nodeName));

    tx = await sendTx(littlepoProductHistoryContract.methods.registerNode(nodeName, retailShopNodeContract.options.address));
    console.log("register Littpo Node", tx.transactionHash);
    
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

    // set previous node
    tx = await sendTx(productPackerNodeContract.methods.setPreviousNode(productHarvesterNodeContract.options.address));
    console.log("==> set Previous for Packer node", tx.transactionHash);

    console.log("Finished deployment");

    testMainFlow(
        legalEntityContract,
        userLoginContract,
        productFactoryContract,
        productHarvesterNodeContract,
        productPackerNodeContract,
        littlepoNodeContract,
        retailShopNodeContract,
        littlepoProductHistoryContract,
        littlepoProductTrackingContract
    );

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

async function testMainFlow(
    legalEntityContract,
    userLoginContract,
    productFactoryContract,
    productHarvesterNodeContract,
    productPackerNodeContract,
    littlepoNodeContract,
    retailShopNodeContract,
    littlepoProductHistoryContract,
    littlepoProductTrackingContract
) {
    let baseProductABI = [{"constant":true,"inputs":[],"name":"bBatchNo","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"nodeId","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"admin","type":"address"}],"name":"removeAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"times","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOperators","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"containerId","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"containerType","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getAdmins","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"location","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newAdmin","type":"address"}],"name":"addAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"productName","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"actions","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"parentNodeIds","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOperator","type":"address"}],"name":"addOperator","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"dateTimeOut","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"operator","type":"address"}],"name":"removeOperator","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"createdTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"productId","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"producerId","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"dateTimeIn","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"legalEntity","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"qrCodeId","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newOperator","type":"address"},{"indexed":false,"name":"isAdd","type":"bool"}],"name":"OperatorAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newAdmin","type":"address"},{"indexed":false,"name":"isAdd","type":"bool"}],"name":"AdminAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":false,"inputs":[{"name":"_action","type":"bytes32"},{"name":"parentQRCodeId","type":"bytes32"},{"name":"_time","type":"uint256"}],"name":"addHistory","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getHistory","outputs":[{"name":"","type":"bytes32[]"},{"name":"","type":"bytes32[]"},{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_timeOut","type":"uint256"}],"name":"setDateTimeOut","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}];
    console.log("Start testing main flow");
    // create product batch for Harvester
    let data = "bQrCode01,productBNo01,B2,B3,B4,B5,B6,B7,B8".split(",");
    let tx = await sendTx(productHarvesterNodeContract.methods.createProductBatch(arrToBytes32(data)));
    console.log("createProductBatch for Harvester Node",data,tx.transactionHash);

    data = "dqrCodeIdNo1,dBatchNo01,productBNo01,D3,D4,D5,D6,D7,D8,D9,D10".split(",");
    tx = await sendTx(productPackerNodeContract.methods.createProductBatch(arrToBytes32(data)));
    console.log("createProductBatch for Packer Node",data, tx.transactionHash);

    data = "dxqrCodeIdNo1,dBatchNo01,productBNo01,T3,T4,T5,T6,T7,T8,T9,T10".split(",");
    tx = await sendTx(productPackerNodeContract.methods.addTeaBagBatch(getBytes32("dqrCodeIdNo1"),arrToBytes32(data)));
    console.log("Create new teabag for Packer Node",data, tx.transactionHash);

    data = "dxqrCodeIdNo2,dBatchNo01,productBNo01,T3,T4,T5,T6,T7,T8,T9,T10".split(",");
    tx = await sendTx(productPackerNodeContract.methods.addTeaBagBatch(getBytes32("dqrCodeIdNo1"),arrToBytes32(data)));
    console.log("Create new teabag for Packer Node",data, tx.transactionHash);

    // let teabag = await littlepoProductHistoryContract.methods.getBaseProducByQR(getBytes32("dxqrCodeIdNo2")).call();
    // let teabagContract = new web3.eth.Contract(baseProductABI,teabag);

    // console.log("Final tracking info", await teabagContract.methods.getHistory().call());

    data = "gQrCodeIdNo1,LA00G,gProducerId,100g".split(",");
    tx = await sendTx(littlepoNodeContract.methods.receiveProductBatch(getBytes32("dqrCodeIdNo1"),arrToBytes32(data)));
    console.log("Receive all teabab in LittleNode",tx.transactionHash);

    // tx = await sendTx(retailShopNodeContract.methods.receiveProductBatch(getBytes32("dxqrCodeIdNo1")));
    // console.log("Receive all teabab in LittleNode",tx);

    data = "iQrCodeIdNo1,dxqrCodeIdNo1,dBatchNo01,productBNo01,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13".split(",");
    tx = await sendTx(retailShopNodeContract.methods.createProductBatch(arrToBytes32(data)));
    console.log("Sell teabag 1",data,tx.transactionHash);

    const tracking = await littlepoProductTrackingContract.methods.getProductTrackingInfo(getBytes32("dqrCodeIdNo1")).call();
    // console.log("TeaBag",teabag);
    // teabagContract = new web3.eth.Contract(baseProductABI,teabag);

    // const tracking = await teabagContract.methods.getHistory().call();

    // console.log("Get tracking history info", tracking);
    const nodes = tracking[0];
    const parentIds = tracking[1];
    const times = tracking[2];

    // console.log(nodes, parentIds, times);

    // nodes.forEach(n => console.log(web3.utils.toAscii(n)));

    console.log("Query detail tracking information");

    if(parentIds && parentIds.length > 0){
        for(let i = 0; i < parentIds.length; i++) {
            let pb = await littlepoProductHistoryContract.methods.getProductBatchByQR(parentIds[i]).call();
            (pb && pb.length > 0) && console.log("Node",getStr(nodes[i]),"=>", pb.map(f => getStr(f)).join()+","+times[i]);
        }
    }
    // parentIds.forEach(await async function(id) {
    //     console.log("Find by id", web3.utils.toAscii(id));
        
    // });

    // times.forEach(time => console.log(time));
}

function arrToBytes32(arr) {
    let na = [];
    arr.forEach(d => na.push(getBytes32(d)));
    return na;
}
function getBytes32(str) {
    return web3.utils.fromAscii(str);
}
function getStr(b) {
    return web3.utils.toAscii(b);
}

main();