pragma solidity ^0.4.24;

import "./ProductBatch.sol";

contract PackerBatch is ProductBatch {
    bytes32 public weight;
    bytes32 public dBatchNo;

    // args1
    // bytes32 _nodeId,
    // bytes32 _productBatchId,
    // bytes32 _dBatchNo,
    // bytes32 _bBatchNo,
    // bytes32 _productName,
    // bytes32 _location,
    // bytes32 _productId,
    // bytes32 _containerId,
    // bytes32 _containerType,
    // bytes32 _legalEntity,
    // bytes32 _producerId,
    // uibytes32nt _weight
    constructor(bytes32 _nodeId, bytes32[] bArgs, uint _harvestTime) public {
        nodeId = _nodeId;
        
        qrCodeId = bArgs[0];
        dBatchNo = bArgs[1];
        bBatchNo = bArgs[2];
        productName = bArgs[3];
        location = bArgs[4];
        productId = bArgs[5];
        containerId = bArgs[6];
        containerType = bArgs[7];
        legalEntity = bArgs[8];
        producerId = bArgs[9];
        weight = bArgs[10];
        harvestTime = _harvestTime;

        createdTime = now;
        dateTimeIn = now;
    }
}