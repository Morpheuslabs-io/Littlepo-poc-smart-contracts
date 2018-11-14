pragma solidity ^0.4.24;

import "./RetailShopBatch.sol";
import "./BaseProduct.sol";
import "./BaseNode.sol";

contract RetailShopNode is BaseNode {
    bytes32 constant NODE_NAME = "RetailShop";
    function getNodeName() public pure returns (bytes32){
        return NODE_NAME;
    }

    function createProductBatch(bytes32[] bArgs) external onlyOperator returns (bool){
        require(littlepoProductHistory != address(0), "Storage is not config yet");
        require(bArgs.length == 14, "Incorrect parameter length, need to be 14");

        RetailShopBatch ph = new RetailShopBatch (NODE_NAME, bArgs);
        // add litlePohistory as operator
        ph.addOperator(littlepoProductHistory);

        // add to center storage
        BaseProduct bp = littlepoProductHistory.getProductBatchByQR(ph.dxQRCodeId());

        littlepoProductHistory.updateTrackingInfo(ph);
        littlepoProductHistory.updateTrackingInfo(bp);

        return true;
    }

    // function addChild(bytes32 _productBatchId, bytes32 _childId, bytes32 _childName, address _childAddress) public onlyOperator returns(bool) {
    //     return productBatches[_productBatchId].addChild(_childId, _childName, _childAddress);
    // }
}