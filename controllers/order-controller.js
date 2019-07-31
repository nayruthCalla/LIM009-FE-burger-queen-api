/* eslint-disable max-len */
/* eslint-disable radix */
const { ObjectId } = require('mongodb');

module.exports = (orderModel, productModel) => ({
  controllerCreateOrder: async (req, resp, next) => {
    const { userId, client, products } = req.body;
    if (!userId || !products) {
      return next(400);
    }
    let arrayProducts;
    try {
      arrayProducts = products.map(async (element) => {
        const productId = element.product;
        const ObjProduct = await productModel.searchDataBase({ _id: new ObjectId(productId) });
        return { qty: element.qty, product: { productId: ObjProduct._id, name: ObjProduct.name, price: ObjProduct.price } };
      });
    } catch (err) {
      return next(404);
    }
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
    const {
      userId, client, products, status,
    } = req.body;
    const { orderid } = req.params;
    let ordersIdDb;
    try {
      ordersIdDb = { _id: new ObjectId(orderid) };
      // console.log(ordersIdDb);
    } catch (error) {
      // console.info(error);
      // return next(401);
    }
    const order = await orderModel.searchDataBase(ordersIdDb);
    if (!order || status === 'canceled') {
      return next(404);
    }
    // eslint-disable-next-line no-mixed-operators
    if ((!userId && !client && !products && !status) || (status !== 'preparing' && status !== 'pending' && status !== 'canceled' && status !== 'delivering' && status !== 'delivered')) {
      return next(400);
    }
    // eslint-disable-next-line no-empty
    const updateOrders = {
      userId, client, products, status,
    };
    if (status === 'delivered') {
      updateOrders.dateProcessed = new Date();
    }
    await orderModel.updateDocument(order._id, updateOrders);
    const updateOrder = await orderModel.searchDataBase(ordersIdDb);
    return resp.send(updateOrder);
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
