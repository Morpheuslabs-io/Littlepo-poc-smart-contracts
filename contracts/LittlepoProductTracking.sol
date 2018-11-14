pragma solidity ^0.4.24;

import "./UserRole.sol";
import "./BaseProduct.sol";
import "./BaseNode.sol";
import "./LittlepoProductHistory.sol";
import "./ProductFactory.sol";

contract LittlepoProductTracking is UserRole {
    LittlepoProductHistory public littlepoHistory;
    ProductFactory public productFactory;

    mapping(bytes32 => uint[]) internal histories;
    mapping(uint => bytes32) internal nodeActions;

    function registerHistory(LittlepoProductHistory _littlepoHistory) public onlyAdmin returns(bool) {
        require(_littlepoHistory != address(0), "Invalid history address");

        littlepoHistory = _littlepoHistory;
        return true;
    }

    function registerProductFactory(ProductFactory _productFactory) public onlyAdmin returns(bool) {
        require(_productFactory != address(0), "Invalid product factory address");
        productFactory = _productFactory;

        return true;
    }

    function getProductBatchByBN(bytes32 _batchNo, bytes32 _nodeId) public view returns (ProductBatch[]) {
        return littlepoHistory.getProductBatchByBN(_batchNo, _nodeId);
    }

    function getProductBatchByQR(bytes32 _qrcodeId) public view returns (BaseProduct) {
        return littlepoHistory.getProductBatchByQR(_qrcodeId);
    }

    // function getProductBatch(bytes32 _qrcodeId) public view returns (ProductBatch) {
    //     return littlepoHistory.getProductBatchByQR(_qrcodeId);
    // }
}