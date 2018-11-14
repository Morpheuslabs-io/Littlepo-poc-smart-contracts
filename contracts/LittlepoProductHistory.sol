pragma solidity ^0.4.24;

import "./UserRole.sol";
import "./BaseProduct.sol";
import "./ProductBatch.sol";
import "./BaseNode.sol";

contract LittlepoProductHistory is UserRole {
    mapping(bytes32 => BaseProduct) internal products;
    mapping(bytes32 => BaseProduct[]) internal productLinks;

    mapping(address => bytes32) internal nodes;
    mapping(address => bool) internal nodeNames;
    mapping(bytes32 => BaseNode) internal baseNodes;

    bytes32[20] internal nodeList;

    uint internal counter = 1;

    function registerNode(bytes32 _nodeName, address _baseNodeAddress) public onlyAdmin returns(bool) {
        require(!nodeNames[_baseNodeAddress], "Node is added already");
        require(nodeList.length <= 20, "Cannot add more nodes");

        nodes[_baseNodeAddress] = _nodeName;
        nodeList[counter - 1] = _nodeName;
        nodeNames[_baseNodeAddress] = true;
        baseNodes[_nodeName] = BaseNode(_baseNodeAddress);
        counter++;

        // add to list operator to able to save histories;
        addOperator(_baseNodeAddress);
        return true;
    }

    function getNodes() external view returns (bytes32[20]) {
        return nodeList;
    }

    function getProductBatchByBN(bytes32 _batchNo, bytes32 _nodeId) public view returns (ProductBatch[]) {
        BaseNode node = baseNodes[_nodeId];
        return node.getProductBatchByBatchNo(_batchNo);
    }

    function getProductBatchByQR(bytes32 _qrCodeId) public view returns (BaseProduct) {
        return products[_qrCodeId];
    }

    function updateTrackingInfo(BaseProduct _baseProduct) public onlyOperator returns (bool){
        require(_baseProduct != address(0), "Invalid history time");
        // require(productBatches[_qrCodeId] != address(0), "Product is added to history already");
        require(nodeNames[msg.sender], "Your node is not register yet");

        BaseProduct product = products[_baseProduct.qrCodeId()];
        if(product == address(0)) {
            products[_baseProduct.qrCodeId()] = _baseProduct;
            product = _baseProduct;
        }

        product.addHistory(nodes[msg.sender], now);

        return true;
    }
}