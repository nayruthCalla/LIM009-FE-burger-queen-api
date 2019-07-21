/* eslint-disable radix */
const { ObjectId } = require('mongodb');
const { dbUrl } = require('../config');
const modelDataBase = require('../models/general-model');

const productModel = modelDataBase('products', dbUrl);

module.exports = orderModel => ({
  controllerCreateOrder: async (req, resp, next) => {
    const { userId, client, products } = req.body;
    if (!userId || !products) {
      return next(400);
    }
    const arrayProducts = products.map(async (element) => {
      const productId = element.product;
      const ObjProduct = await productModel.searchDataBase({ _id: new ObjectId(productId) });
      return { qty: element.qty, product: { productId: ObjProduct._id, name: ObjProduct.name, price: ObjProduct.price } };
    });
    const newOrder = await orderModel.createDocument({
      userId, client, products: await Promise.all(arrayProducts), status: 'pending', dateEntry: new Date(),
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
  controllerGetOrderById: async (req, resp, next) => {
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
  controllerPutOrderById: async (req, resp, next) => {
  /*  try {
      const {
        userId, client, products, status,
      } = req.body;
      const { orderid } = req.params;
      const ordersIdDb = { _id: new ObjectId(orderid) };
      console.log(ordersIdDb);

      if (!userId && !client && !products && !status) {
        return next(400);
      }

      if (status && (status !== 'pending' || status !== 'canceled' || status !== 'delivering' || status !== 'delivered')) {
        return next(400);
      }

      const order = await orderModel.searchDataBase(ordersIdDb);
      if (!order) {
        return next(401);
      }

      await orderModel.updateDocument({ _id: order._id, 'products.$.product.productId': new ObjectId(products[0].productId) },
        {
          $set: { 'products.$.qty': products[0].qty },
        });
      const updateOrder = await orderModel.searchDataBase(ordersIdDb);
      return resp.send(updateOrder);
    } catch (error) {
      console.info(error);
      // return next(404);
    } */
  },
  controllerDeleteOrderById: async (req, resp, next) => {
    try {
      const { orderid } = req.params;
      const ordersIdDb = { _id: new ObjectId(orderid) };
      const order = await orderModel.searchDataBase(ordersIdDb);
      if (!order) {
        return next(404);
      }
      await orderModel.deleteDocument(order._id);
      return resp.send(order);
    } catch (error) {
      return next(404);
    }
  },
});
