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
  controllerGetAllorders: async (req, resp, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = ((limit * page) - limit);

    const orders = await orderModel.showListCollections(skip, limit);
    if (!orders) {
      return next(404);
    }

    const count = await orderModel.countCollections();
    const numPages = Math.ceil(count / limit);

    const firstPage = `</orders?page=${numPages - (numPages - 1)}&&limit=${limit}>; rel="first"`;
    const lastPage = `</orders?page=${numPages}&&limit=${limit}>; rel="last"`;
    const prevPage = `</orders?page=${page - 1 === 0 ? 1 : page - 1}&&limit=${limit}>; rel="prev"`;
    const nextPage = `</orders?page=${page === numPages ? page : page + 1}&&limit=${limit}>; rel="next"`;

    resp.set('link', `${firstPage}, ${lastPage}, ${prevPage}, ${nextPage}`);

    return resp.send(orders);
  },
  controllerGetorderById: async (req, resp, next) => {
    try {
      const { orderid } = req.params;
      const ordersIdDb = { _id: new ObjectId(orderid) };
      const order = await orderModel.searchDataBase(ordersIdDb);
      if (!order) {
        return next(404);
      }
      return resp.send(order);
    } catch (error) {
      return next(404);
    }
  },
});
