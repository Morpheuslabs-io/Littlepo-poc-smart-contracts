"use strict"

const ProductManager = function() {
    this.products = new Map();

    this.init();
}

ProductManager.prototype.init = function () {
    // create product list
    let product = {};
    product.id = "PD0001";
    product.name = "Tea Leaf";

    this.products.set(product.id, product);

    product = {};
    product.id = "PK0001";
    product.name = "Tea Package";

    this.products.set(product.id, product);

    product = {};
    product.id = "TB0001";
    product.name = "Tea Bag";

    this.products.set(product.id, product);

    product = {};
    product.id = "TC0001";
    product.name = "Tea Cup";

    this.products.set(product.id, product);

    console.log(this.products);
}

ProductManager.prototype.getProduct = function (id) {
    return this.products.get(id);
}

module.exports = ProductManager;