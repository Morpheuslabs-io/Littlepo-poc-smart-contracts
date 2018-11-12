pragma solidity ^0.4.24;

import "./UserRole.sol";
import "./Product.sol";

/**
 * Base product, all product will inheritance from this product
 */
contract ProductFactory is UserRole {
    mapping(bytes32 => Product) internal products;
    bytes32[] internal listProducts;

    function createProduct(
        bytes32 _productId,
        bytes32 _productName,
        bytes32 _location,
        bytes32 _containerId,
        bytes32 _containerType
    ) public onlyAdmin returns (bool) {
        require(products[_productId] == address(0), "Product is address already");

        products[_productId] = new Product(
            _productId,
            _productName,
            _location,
            _containerId,
            _containerType
        );

        listProducts.push(_productId);
        emit ProductAdded(_productId, false);
        return true;
    }

    function removeProduct (bytes32 _productId) public onlyOwner {
        require(products[_productId] != address(0), "Invalid product id");

        for (uint i = 0; i < listProducts.length; ++i) {
            if (listProducts[i] == _productId) {
                listProducts[i] = listProducts[listProducts.length - 1];
                listProducts.length -= 1;
                emit ProductAdded(_productId, false);
                break;
            }
        }
    }

    function getProductInfo(bytes32 productId) public view returns(Product) {
        return products[productId];
    }

    event ProductAdded(bytes32 productId, bool isAdd);
}