pragma solidity ^0.4.24;

import "./BaseNode.sol";
import "./BaseProduct.sol";
import "./PackerBatch.sol";
import "./LittlepoBatch.sol";

contract LittlepoNode is BaseNode {
    bytes32 constant NODE_NAME = "Littlepo";
    function getNodeName() public pure returns (bytes32){
        return NODE_NAME;
    }

    // bytes32 _nodeId,
    // bytes32 _qrCodeId,
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
    function createProductBatch(bytes32[] bArgs) external onlyOperator returns (bool){
        require(littlepoProductHistory != address(0), "Storage is not config yet");
        require(bArgs.length == 11, "Incorrect parameter length, need to be 9");
        require(productBatches[bArgs[0]] == address(0), "Package is already created");

        LittlepoBatch ph = new LittlepoBatch (NODE_NAME,bArgs);

        // add litlePohistory as operator
        productBatches[ph.qrCodeId()] = ph;

        ph.addOperator(littlepoProductHistory);
        littlepoProductHistory.updateTrackingInfo(ph.qrCodeId(),ph);

        return true;
    }

    // bytes32 _qrCodeId,
    // bytes32 _location,
    // bytes32 _producerId,
    // bytes32 _weight
    // _qrCodeId: qrCodeId of Packer package
    function receiveProductBatch(bytes32 _packerQRCodeId, bytes32[] bArgs) public onlyOperator returns (bool) {
        require(littlepoProductHistory != address(0), "Storage is not config yet");
        require(bArgs.length == 4, "Incorrect parameter length, need to be 4");
        require(productBatches[bArgs[0]] == address(0), "Package is already created");

        PackerBatch baseProduct = PackerBatch(littlepoProductHistory.getBaseProducByQR(_packerQRCodeId));
        require(baseProduct != address(0), "Packer package does not exist");
        
        bytes32[] memory uArgs = new bytes32[](11);
        uArgs[0] = bArgs[0];
        uArgs[1] = baseProduct.dBatchNo();
        uArgs[2] = baseProduct.bBatchNo();
        uArgs[3] = baseProduct.productName();
        uArgs[4] = bArgs[1];
        uArgs[5] = baseProduct.productId();
        uArgs[6] = baseProduct.containerId();
        uArgs[7] = baseProduct.containerType();
        uArgs[8] = baseProduct.legalEntity();
        uArgs[9] = bArgs[2];
        uArgs[10] = bArgs[3];

        LittlepoBatch ph = new LittlepoBatch (NODE_NAME,uArgs);
        
        ph.addOperator(littlepoProductHistory);
        littlepoProductHistory.updateTrackingInfo(ph.qrCodeId(),ph);

        bytes32[] memory childIds = littlepoProductHistory.getChildsOfProductBatch(_packerQRCodeId);

        for(uint i = 0; i < childIds.length; i++) {
            BaseProduct child = littlepoProductHistory.getBaseProducByQR(childIds[i]);
            child.addHistory(NODE_NAME, ph.qrCodeId(), now);
        }
        
        return true;
    }

    function getProductBatchInfo(bytes32 _qrCodeId) 
        public view returns(bytes32[]){

        LittlepoBatch ph = LittlepoBatch(productBatches[_qrCodeId]);
        bytes32[] memory ret = new bytes32[](11);
    // bytes32 _nodeId,
    // bytes32 _productBatchId,
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
        // ret[10] = ph.createdTime();

        return ret;
    }
}