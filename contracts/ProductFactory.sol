pragma solidity ^0.4.24;

import "./UserRole.sol";
import "./Product.sol";

/**
 * Base product, all product will inheritance from this product
 */
contract ProductFactory is UserRole {
    mapping(uint => Product) internal products;
    uint[] internal listProducts;

    function createProduct(
        uint _productId,
        string _productName,
        string _location,
        uint _containerId,
        uint _containerType
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

    function removeProduct (uint _productId) public onlyOwner {
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

    function getProductInfo(uint productId) public view returns(Product) {
        return products[productId];
    }

    event ProductAdded(uint productId, bool isAdd);
}