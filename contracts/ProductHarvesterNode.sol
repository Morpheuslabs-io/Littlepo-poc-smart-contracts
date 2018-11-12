pragma solidity ^0.4.24;

// import "./UserRole.sol";
import "./BaseNode.sol";
import "./HarvesterBatch.sol";
import "./LegalEntity.sol";
import "./LittlepoProductHistory.sol";

contract ProductHarvesterNode is BaseNode {
    bytes32 constant NODE_NAME = "ProductHarvester";

    // Input format
    // bytes32 _productBatchId,
    // bytes32 _bBatchNo,
    // bytes32 _productName,
    // bytes32 _location,
    // bytes32 _productId,
    // bytes32 _producerId,
    // bytes32 _containerId,
    // bytes32 _containerType,
    // bytes32 _legalEntity
    function createProductBatch(bytes32[] bArgs) external onlyOperator returns (bool){
        require(littlepoProductHistory != address(0), "Storage is not config yet");
        // require(productBatches[_productBatchNo] == address(0), "Product batch is added already");
        
        // NODE_NAME
        HarvesterBatch ph = new HarvesterBatch (NODE_NAME, bArgs);

        productBatches[ph.productBatchId()] = ph;
        productLinks[ph.bBatchNo()] = ph.productBatchId();
        // add litlePohistory as operator
        ph.addOperator(littlepoProductHistory);
        littlepoProductHistory.updateTrackingInfo(ph.bBatchNo(), ph);

        return true;
    }
}