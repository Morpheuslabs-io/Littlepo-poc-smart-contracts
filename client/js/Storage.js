"use strict";
const VERSION = 1;

const Storage = function () {
  this.storage_ = window.localStorage;
  if (this.storage_ == undefined) alert('Your browser does not support storage, cannot save log information');

  this.init();
};

Storage.prototype.init = function() {
}

Storage.prototype.saveItem = function(key, item) {
  console.log("Store item", item);
  this.storage_.setItem(key, JSON.stringify(item));
}

Storage.prototype.getItem = function(key) {
    console.log("Get item", key);
    this.storage_.getItem(key);
  }

