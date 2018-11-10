pragma solidity ^0.4.24;

import "./UserRole.sol";
import "./ProductBatch.sol";
import "./LittlepoProductHistory.sol";

contract BaseNode is UserRole {

    mapping(bytes32 => ProductBatch) internal productBatches;
    mapping(bytes32 => bytes32) internal productLinks;

    LittlepoProductHistory public littlepoProductHistory;
    bytes32 constant NODE_NAME = "BaseNode";

    function getNodeName() public pure returns (bytes32){
        return NODE_NAME;
    }

    function setProductStorage(LittlepoProductHistory _littlepoProductHistory) public onlyAdmin returns(bool) {
        require(_littlepoProductHistory != address(0), "Invalid storage address");

        littlepoProductHistory = _littlepoProductHistory;
    }

    function getProductBatchInfo(bytes32 _productBatchId) public view returns(ProductBatch){
        return productBatches[_productBatchId];
    }

    function getProductBatchByBatchNo(bytes32 _bBatchNo) public view returns(ProductBatch){
        return productBatches[productLinks[_bBatchNo]];
    }

    function addChild(bytes32 _productBatchId, bytes32 _childId, bytes32 _childName, address _childAddress) public onlyOperator returns(bool) {
        return productBatches[_productBatchId].addChild(_childId, _childName, _childAddress);
    }

    // customer node need to implememt createProductBatch to customer adding Product
    //function createProductBatch() external returns(bool);

}