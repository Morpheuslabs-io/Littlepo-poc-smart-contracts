pragma solidity ^0.4.24;

import "./ProductBatch.sol";

contract HarvesterBatch is ProductBatch {
    // ==> args 1
    // bytes32 _nodeId, --> auto set

    // bytes32 _productBatchId,
    // bytes32 _bBatchNo,
    // bytes32 _productName,
    // bytes32 _location,

    // ==> args 2
    // uint _productId,
    // uint _producerId,
    // uint _containerId,
    // uint _containerType,
    // uint _legalEntity
    constructor(bytes32 _nodeId, bytes32[] bArgs) public {
        //args1
        nodeId = _nodeId;
        productBatchId = bArgs[0];
        bBatchNo = bArgs[1];
        productName = bArgs[2];
        location = bArgs[3];
        productId = bArgs[4];
        producerId = bArgs[5];
        containerId = bArgs[6];
        containerType = bArgs[7];
        legalEntity = bArgs[8];

        //args2
        createdTime = now;
        dateTimeIn = now;
    }
}