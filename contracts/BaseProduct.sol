pragma solidity ^0.4.24;

import "./UserRole.sol";

contract BaseProduct is UserRole{
    bytes32 public nodeId;
    bytes32 public qrCodeId; // identifier of product
    bytes32 public bBatchNo;
    bytes32 public productName;
    bytes32 public location;
    bytes32 public productId;
    bytes32 public producerId;
    bytes32 public containerId;
    bytes32 public containerType;
    bytes32 public legalEntity;
    bytes32 public txHash;
    bytes32 public pNodeQRCodeId;
    
    uint public harvestTime;
    uint public createdTime;
    uint public dateTimeIn;
    uint public dateTimeOut;

    // history
    bytes32[] public actions;
    bytes32[] public parentNodeIds;
    uint[] public times;

    function addHistory(bytes32 _action, bytes32 parentQRCodeId, uint _time) public onlyOperator returns (bool) {
        require(_time > 0, "Invalid history time");

        actions.push(_action);
        parentNodeIds.push(parentQRCodeId);
        times.push(_time);

        return true;
    }

    function getHistory () public view returns (bytes32[],bytes32[], uint[]) {
        return (actions, parentNodeIds, times);
    }
    
    function setDateTimeOut(uint _timeOut) public onlyOperator returns(bool){
        dateTimeOut = _timeOut;
    }

    function setTxHash(bytes32 _txHash) public onlyOperator returns(bool) {
        txHash = _txHash;
    }
}