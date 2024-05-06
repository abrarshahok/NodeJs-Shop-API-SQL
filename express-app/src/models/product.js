const path = require("path");
const fs = require("fs");

const filePath = path.join(path.resolve(), "src", "data", "products.json");

const getProductsFromFile = (callback) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      callback([]);
    } else {
      callback(JSON.parse(data));
    }
  });
};

const saveProductsToFile = (products, callback) => {
  fs.writeFile(filePath, JSON.stringify(products), callback);
};

class Product {
  constructor(id, name, price, description) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.description = description;
  }

  static addProduct(product) {
    getProductsFromFile((products) => {
      products.push(product);
      saveProductsToFile(products, (err) => {
        if (err) {
          return { statusCode: 500, message: "Error saving product" };
        } else {
          return {
            statusCode: 200,
            message: `Product added successfully`,
            body: product,
          };
        }
      });
    });
  }

  static fetchAll() {
    let promise = new Promise((resolve, reject) => {
      getProductsFromFile((products) => {
        resolve(products);
      });
    });
    return promise;
  }

  static getProductById(id) {
    const promise = new Promise((resolve, reject) => {
      getProductsFromFile((products) => {
        try {
          const product = products.find((pr) => pr.id == id);
          if (product) {
            resolve(product);
          } else {
            reject({ statusCode: 404, message: "Product not found" });
          }
        } catch (error) {
          reject({ statusCode: 500, message: "Error fetching product" });
        }
      });
    });
    return promise;
  }

  static deleteProduct(id) {
    const promise = new Promise((resolve, reject) => {
      getProductsFromFile((products) => {
        const productIndex = products.findIndex((pr) => pr.id == id);
        if (productIndex != -1) {
          products.splice(productIndex, 1);
          saveProductsToFile(products, (err) => {
            if (err) {
              reject({ statusCode: 500, message: "Error deleting product" });
            } else {
              resolve({
                statusCode: 200,
                message: `Product deleted with id: ${id}`,
              });
            }
          });
        } else {
          reject({ statusCode: 404, message: "Product not found" });
        }
      });
    });
    return promise;
  }

  static updateProduct(id, name, price, description) {
    const promise = new Promise((resolve, reject) => {
      getProductsFromFile((products) => {
        const productIndex = products.findIndex((pr) => pr.id == id);
        if (productIndex !== -1) {
          const oldProduct = products[productIndex];
          const newProduct = {
            id,
            name: name || oldProduct.name,
            price: price || oldProduct.price,
            description: description || oldProduct.description,
          };
          products[productIndex] = newProduct;
          saveProductsToFile(products, (err) => {
            if (err) {
              reject({ statusCode: 500, message: "Error updating product" });
            } else {
              resolve({
                statusCode: 200,
                message: `Product updated successfully`,
                body: newProduct,
              });
            }
          });
        } else {
          reject({ statusCode: 404, message: "Product not found" });
        }
      });
    });
    return promise;
  }
}

module.exports = Product;
