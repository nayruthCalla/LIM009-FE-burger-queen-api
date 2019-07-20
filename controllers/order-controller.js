/* eslint-disable radix */
const { ObjectId } = require('mongodb');
const { dbUrl } = require('../config');
const modelDataBase = require('../models/general-model');

const productModel = modelDataBase('products', dbUrl);

module.exports = orderModel => ({
  controllerCreateOrder: async (req, resp, next) => {
    const {
      userId, client, products,
    } = req.body;
    if (!userId || !products) {
      return next(400);
    }
    products.forEach(async (element) => {
      // ids converted into objectId
      const id = new ObjectId(element.product);
      // console.log(typeof element.product)
      const dateProduct = await productModel.searchDataBase(id);
      //   products.push( gtdateProduct)
      element.product = dateProduct;
    });
    const newOrder = await orderModel.createDocument({
      userId, client, products, status: 'pending', dateEntry: new Date(),
    });
    return resp.send(newOrder.ops[0]);
  },
  
});
