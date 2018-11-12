pragma solidity ^0.4.24;

contract BaseProduct {
    bytes32 public nodeId;
    bytes32 public productBatchId;
    bytes32 public bBatchNo;
    bytes32 public dBatchNo;
    bytes32 public productName;
    bytes32 public location;
    bytes32 public productId;
    bytes32 public producerId;
    bytes32 public containerId;
    bytes32 public containerType;
    bytes32 public legalEntity;

    uint public createdTime;
    uint public dateTimeIn;
    uint public dateTimeOut;
}