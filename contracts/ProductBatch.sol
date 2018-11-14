pragma solidity ^0.4.24;

import "./BaseProduct.sol";

contract ProductBatch is BaseProduct {
    bytes32 public bBatchNo;
    
    uint private MAX_PRODUCT_CHILD = 100;
    uint public version = 1;

    // child productBatchNo
    bytes32[] public childIds;
    // child productBatchName
    bytes32[] public childNames;
    // child productBatch address
    address[] public childAddress;

    uint public childCounter = 1;
    
    function addChild(BaseProduct _child) public onlyOperator returns(bool){
        require(childCounter < MAX_PRODUCT_CHILD, "Cannot add more child");

        childIds[childCounter - 1] = _child.qrCodeId();
        childNames[childCounter - 1] = _child.productName();
        childAddress.push(address(_child));

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

    function getListChilds() public view returns(bytes32[],bytes32[], address[]) {
        return (childIds, childNames, childAddress);
    }
}