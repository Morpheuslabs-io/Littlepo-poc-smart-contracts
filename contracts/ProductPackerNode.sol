pragma solidity ^0.4.24;

import "./BaseNode.sol";
import "./PackerBatch.sol";
import "./TeaBag.sol";

contract ProductPackerNode is BaseNode {
    bytes32 constant NODE_NAME = "Pack";
    function getNodeName() public pure returns (bytes32){
        return NODE_NAME;
    }
    // input format
    // bytes32 _productBatchId,
    // bytes32 _bQRCodeId,
    // bytes32 _dBatchNo,
    // bytes32 _productName,
    // bytes32 _location,
    // bytes32 _productId,
    // bytes32 _containerId,
    // bytes32 _containerType,
    // bytes32 _legalEntity,
    // bytes32 _producerId,
    // bytes32 _weight

    function createProductBatch(bytes32[] bArgs) external onlyOperator returns (bool){
        require(littlepoProductHistory != address(0), "Storage is not config yet");
        require(bArgs.length == 11, "Incorrect parameter length, need to be 11");
        require(productBatches[bArgs[0]] == address(0), "Package is already created");

        BaseProduct harvestProduct = littlepoProductHistory.getBaseProducByQR(bArgs[1]);
        require(harvestProduct != address(0), "bBatchNo does not exist");

        bytes32[] memory uArgs = new bytes32[](11);

        uArgs[0] = bArgs[0];
        uArgs[1] = harvestProduct.bBatchNo();
        uArgs[2] = bArgs[2];
        uArgs[3] = bArgs[3];
        uArgs[4] = bArgs[4];
        uArgs[5] = bArgs[5];
        uArgs[6] = bArgs[6];
        uArgs[7] = bArgs[7];
        uArgs[8] = bArgs[8];
        uArgs[9] = bArgs[9];
        uArgs[10] = bArgs[10];

        PackerBatch pb = new PackerBatch (NODE_NAME, uArgs, harvestProduct.createdTime());
        // add litlePohistory as operator
        productBatches[pb.qrCodeId()] = pb;
        productLinks[pb.dBatchNo()].push(pb);

        pb.addOperator(littlepoProductHistory);
        // littlepoProductHistory.updateTrackingInfo(pb.qrCodeId(), pb);
        littlepoProductHistory.updateTrackingInfo(pb.qrCodeId(), pb);

        return true;
    }

    // bytes32 _qrCodeId, (dxQrCodeId)
    // bytes32 _dBatchNo
    // bytes32 _bBatchNo,
    // bytes32 _productName,
    // bytes32 _location,
    // bytes32 _productId,
    // bytes32 _producerId,
    // bytes32 _containerId,
    // bytes32 _containerType,
    // bytes32 _legalEntity
    function addTeaBagBatch(bytes32 _packerBatchQRId, bytes32[] bArgs) public onlyOperator returns (bool) {
        require(littlepoProductHistory != address(0), "Storage is not config yet");
        require(bArgs.length == 11, "Incorrect parameter length, need to be 11");
        // require(productBatches[bArgs[0]] == address(0), "Package is already created");
        require(productBatches[_packerBatchQRId] != address(0), "Packer batch does not exist");

        ProductBatch packerBatch = productBatches[_packerBatchQRId];
        PackerBatch tb = new PackerBatch (NODE_NAME, bArgs, packerBatch.harvestTime());

        // add litlePohistory as operator
        tb.addHistory("Harvest", packerBatch.qrCodeId(), packerBatch.harvestTime());
        tb.transferOwnership(littlepoProductHistory);
        productBatches[tb.qrCodeId()] = tb;

        littlepoProductHistory.updateTrackingInfo(_packerBatchQRId, tb);
        littlepoProductHistory.addChildForProductBatch(_packerBatchQRId, tb);

        // tb.transferOwnership(littlepoProductHistory);
        littlepoProductHistory.shareOperator(tb);

        return true;
    }

    function getProductBatchInfo(bytes32 _qrCodeId) public view returns(bytes32[]){

        PackerBatch ph = PackerBatch(productBatches[_qrCodeId]);
        bytes32[] memory ret = new bytes32[](10);
    // bytes32 _dBatchNo,
    // bytes32 _bBatchNo,
    // bytes32 _productName,
    // bytes32 _location,
    // bytes32 _productId,
    // bytes32 _containerId,
    // bytes32 _containerType,
    // bytes32 _legalEntity,
    // bytes32 _producerId,
    // bytes32 _weight
        ret[0] = ph.bBatchNo();
        ret[1] = ph.productName();
        ret[2] = ph.location();
        ret[3] = ph.productId();
        ret[4] = ph.producerId();
        ret[5] = ph.containerId();
        ret[6] = ph.containerType();
        ret[7] = ph.legalEntity();

        ret[8] = ph.dBatchNo();
        ret[9] = ph.weight();


        return ret;
    }
}