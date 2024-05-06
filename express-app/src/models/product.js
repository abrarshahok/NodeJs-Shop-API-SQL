const path = require("path");
const fs = require("fs");
const db = require("../utils/database.js");

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

  static async fetchAll() {
    const result = await db.execute("SELECT * FROM Products");

    const products = result[0];

    if (products.length === 0) {
      return { statusCode: 404, message: "Products not found!" };
    }

    return products;
  }

  static async getProductById(id) {
    const result = await db.execute(`SELECT * FROM Products where id = ${id}`);

    const product = result[0][0];

    if (!product) {
      return { statusCode: 404, message: "Product not found!" };
    }

    return product;
  }

  static async deleteProduct(id) {
    const result = await db.execute(`DELETE FROM Products where id = ${id}`);

    const isDeleted = result[0].affectedRows != 0;

    if (!isDeleted) {
      return { statusCode: 404, message: "Product not found!" };
    }

    return {
      statusCode: 200,
      message: `Product deleted with id: ${id}`,
    };
  }

  static async updateProduct(id, name, price, description) {
    const oldProduct = await this.getProductById(id);

    if (!oldProduct) {
      return { statusCode: 404, message: "Product not found" };
    }

    const newProduct = {
      id,
      name: name || oldProduct.name,
      price: price || oldProduct.price,
      description: description || oldProduct.description,
    };

    const result = await db.execute(
      `UPDATE Products SET name = ?, price = ?, description = ? WHERE id = ?`,
      [newProduct.name, newProduct.price, newProduct.description, id]
    );

    const isUpdated = result[0].affectedRows != 0;

    if (!isUpdated) {
      return { statusCode: 404, message: "Product not found" };
    }

    return {
      statusCode: 200,
      message: `Product updated successfully`,
      body: newProduct,
    };
  }
}

module.exports = Product;
