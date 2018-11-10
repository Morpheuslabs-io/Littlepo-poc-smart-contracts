pragma solidity ^0.4.24;

import "./ProductBatch.sol";

contract HarvesterBatch is ProductBatch {
    // ==> args 1
    // bytes32 _nodeId,
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
    constructor(bytes32 _nodeId, bytes32[] bArgs, uint[] uArgs) public {
        //args1
        nodeId = _nodeId;
        productBatchId = bArgs[0];
        bBatchNo = bArgs[1];
        productName = bArgs[2];
        location = bArgs[3];
        //args2
        productId = uArgs[0];
        producerId = uArgs[1];
        containerId = uArgs[2];
        containerType = uArgs[3];
        legalEntity = uArgs[4];

        createdTime = now;
        dateTimeIn = now;
    }
}