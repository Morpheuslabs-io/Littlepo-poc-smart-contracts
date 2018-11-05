pragma solidity ^0.4.24;

import "./UserRole.sol";
import "./BaseProduct.sol";
import "./BaseNode.sol";
import "./ProductHarvester.sol";
import "./LegalEntity.sol";

contract ProductHarvesterNode is BaseNode, UserRole {
    LegalEntity public le;
    uint public legalEntityId;
    string public nodeKey;

    mapping(uint => ProductHarvester) internal productBatches;
    uint[] public listProductBatches;

    constructor() public {
        nodeKey = "ProductHarvestNode";
    }

    function createProductBatch(
        uint _productId,
        string _productName,
        uint _batchNo,
        uint _legalEntity,
        string _location,
        uint _containerId,
        uint _containerType
    ) external onlyOperator returns (bool){
        require(productBatches[_batchNo] != address(0), "Product Batch is added already");

        ProductHarvester ph = new ProductHarvester (
            _productId,
            _productName,
            _batchNo,
            _legalEntity,
            _location,
            _containerId,
            _containerType
        );

        productBatches[_batchNo] = ph;
        listProductBatches.push(_batchNo);
        return true;
    }

    function getProductBatchInfo(uint _productBatchNo) public view returns (BaseProduct) {
        return productBatches[_productBatchNo];
    }

}