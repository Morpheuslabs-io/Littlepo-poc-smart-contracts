pragma solidity ^0.4.24;

import "./UserRole.sol";
import "./ProductBatch.sol";
import "./LittlepoProductHistory.sol";

contract BaseNode is UserRole {
    // bytes32 constant NODE_NAME = "BaseNode";
    
    mapping(bytes32 => ProductBatch) internal productBatches;
    mapping(bytes32 => ProductBatch[]) internal productLinks;

    LittlepoProductHistory public littlepoProductHistory;
    BaseNode public previousNode;
    
    function setPreviousNode(BaseNode _baseNode) public onlyAdmin returns(bool) {
        previousNode = _baseNode;
        return true;
    }

    function setProductStorage(LittlepoProductHistory _littlepoProductHistory) public onlyAdmin returns(bool) {
        require(_littlepoProductHistory != address(0), "Invalid storage address");

        littlepoProductHistory = _littlepoProductHistory;
    }

    function getProductBatchInfo(bytes32 _qrCodeId) public view returns(ProductBatch){
        return productBatches[_qrCodeId];
    }

    function getProductBatchByBatchNo(bytes32 _bBatchNo) public view returns(ProductBatch[]){
        return productLinks[_bBatchNo];
    }

    // function addChild(bytes32 _qrCodeId, bytes32 _childId, bytes32 _childName, address _childAddress) public onlyOperator returns(bool) {
    //     return productBatches[_qrCodeId].addChild(_childId, _childName, _childAddress);
    // }

    // customer node need to implememt createProductBatch to customer adding Product
    //function createProductBatch() external returns(bool);

}