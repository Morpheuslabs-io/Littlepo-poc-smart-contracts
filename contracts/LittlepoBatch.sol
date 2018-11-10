pragma solidity ^0.4.24;

import "./ProductBatch.sol";

contract LittlepoBatch is ProductBatch {

    uint public weight;

    // bytes32 _nodeId,
    // bytes32 _productBatchId,
    // bytes32 _dBatchNo,
    // bytes32 _bBatchNo,
    // bytes32 _productName,
    // bytes32 _location,

    // uint _productId,
    // uint _containerId,
    // uint _containerType,
    // uint _legalEntity,
    // uint _producerId,
    // uint _weight

    constructor(bytes32 _nodeId, bytes32[] bArgs, uint[] uArgs) public {
        nodeId = _nodeId;

        productBatchId = bArgs[0];
        dBatchNo = bArgs[1];
        bBatchNo = bArgs[2];
        productName = bArgs[3];
        location = bArgs[4];

        productId = uArgs[0];
        containerId = uArgs[1];
        containerType = uArgs[2];
        legalEntity = uArgs[3];
        producerId = uArgs[4];
        weight = uArgs[5];

        createdTime = now;
        dateTimeIn = now;
    }
}