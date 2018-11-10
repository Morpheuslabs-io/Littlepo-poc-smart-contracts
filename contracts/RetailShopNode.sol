pragma solidity ^0.4.24;

import "./RetailShopBatch.sol";
import "./BaseNode.sol";

contract RetailShopNode is BaseNode {
    bytes32 constant NODE_NAME = "RetailShop";

    function createProductBatch(bytes32[] bArgs, uint[] uArgs) external onlyOperator returns (bool){
        require(littlepoProductHistory != address(0), "Storage is not config yet");

        RetailShopBatch ph = new RetailShopBatch (NODE_NAME, bArgs, uArgs);

        // add litlePohistory as operator
        ph.addOperator(littlepoProductHistory);

        // add to center storage
        littlepoProductHistory.updateTrackingInfo(ph.dBatchNo(), ph);
        littlepoProductHistory.setAlias(ph.dBatchNo(), ph.dxQRCodeId());

        return true;
    }

    // function addChild(bytes32 _productBatchId, bytes32 _childId, bytes32 _childName, address _childAddress) public onlyOperator returns(bool) {
    //     return productBatches[_productBatchId].addChild(_childId, _childName, _childAddress);
    // }
}