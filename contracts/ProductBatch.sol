pragma solidity ^0.4.24;

import "./UserRole.sol";
import "./BaseProduct.sol";

contract ProductBatch is UserRole, BaseProduct {
    uint private MAX_PRODUCT_CHILD = 100;
    uint public version = 1;

    // child productBatchNo
    bytes32[100] public childIds;
    // child productBatchName
    bytes32[100] public childNames;
    // child productBatch address
    address[] public childAddress;
    uint public childCounter = 1;
    
    function addChild(bytes32 _childId, bytes32 _childName, address _childAddress) public onlyOperator returns(bool){
        require(childCounter < MAX_PRODUCT_CHILD, "Cannot add more child");

        childIds[childCounter - 1] = _childId;
        childNames[childCounter - 1] = _childName;
        childAddress.push(_childAddress);

        childCounter++;

        return true;
    }

    function removeChild(bytes32 _childId) public onlyOperator returns(bool){
        for(uint i = 0; i < childIds.length; i++) {
            if(childIds[i] == _childId) {
                childIds[i] = childIds[childCounter - 1];
                childIds[childCounter - 1];
            }
        }
    }

    function setDateTimeOut(uint _timeOut) public onlyOperator returns(bool){
        dateTimeOut = _timeOut;
    }

    function getListChilds() public view returns(bytes32[100], address[]) {
        return (childNames, childAddress);
    }
}