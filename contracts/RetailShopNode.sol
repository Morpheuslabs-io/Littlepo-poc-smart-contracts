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
        BaseProduct bp = littlepoProductHistory.getBaseProducByQR(ph.dxQRCodeId());

        littlepoProductHistory.updateTrackingInfo(ph.qrCodeId(), ph);
        littlepoProductHistory.updateTrackingInfo(ph.qrCodeId(), bp);

        return true;
    }

    function getProductBatchInfo(bytes32 _qrCodeId) 
        public view returns(bytes32[]){

        RetailShopBatch ph = RetailShopBatch(productBatches[_qrCodeId]);
        bytes32[] memory ret = new bytes32[](13);
        // qrCodeId = bArgs[0];
        // dxQRCodeId = bArgs[1];
        // dBatchNo = bArgs[2];
        // bBatchNo = bArgs[3];
        // productName = bArgs[4];
        // location = bArgs[5];

        // productId = bArgs[6];
        // containerId = bArgs[7];
        // containerType = bArgs[8];
        // legalEntity = bArgs[9];
        // producerId = bArgs[10];
        // quantity = bArgs[11];
        // price = bArgs[12];
        // waterTemperature = bArgs[13];
        ret[0] = ph.bBatchNo();
        ret[1] = ph.productName();
        ret[2] = ph.location();
        ret[3] = ph.productId();
        ret[4] = ph.producerId();
        ret[5] = ph.containerId();
        ret[6] = ph.containerType();
        ret[7] = ph.legalEntity();

        ret[8] = ph.dBatchNo();
        ret[9] = ph.dxQRCodeId();
        ret[10] = ph.quantity();
        ret[11] = ph.price();
        ret[12] = ph.waterTemperature();

        return ret;
    }
}