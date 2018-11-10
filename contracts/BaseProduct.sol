pragma solidity ^0.4.24;

contract BaseProduct {
    bytes32 public nodeId;
    bytes32 public productBatchId;
    bytes32 public bBatchNo;
    bytes32 public dBatchNo;
    bytes32 public productName;
    bytes32 public location;

    uint public productId;
    uint public producerId;
    uint public createdTime;
    uint public dateTimeIn;
    uint public dateTimeOut;
    uint public containerId;
    uint public containerType;
    uint public legalEntity;
}