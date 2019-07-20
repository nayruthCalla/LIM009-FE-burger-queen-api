/* eslint-disable radix */
const { ObjectId } = require('mongodb');

module.exports = productModel => ({
  controllerCreateProduct: async (req, resp, next) => {
    const {
      name, price, image, type,
    } = req.body;
    if (!name || !price || typeof price !== 'number') {
      return next(400);
    }
    // const validatePrice = (typeof price === 'number' ? price : parseInt(price));
    const newProduct = await productModel.createDocument({
      name, price, image, type, dateEntry: new Date(),
    });
    return resp.send(newProduct.ops[0]);
  },
  controllerGetAllProducts: async (req, resp) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = ((limit * page) - limit);

    const products = await productModel.showListCollections(skip, limit);

    const count = await productModel.countCollections();
    const numPages = Math.ceil(count / limit);

    const firstPage = `</products?page=${numPages - (numPages - 1)}&&limit=${limit}>; rel="first"`;
    const lastPage = `</products?page=${numPages}&&limit=${limit}>; rel="last"`;
    const prevPage = `</products?page=${page - 1 === 0 ? 1 : page - 1}&&limit=${limit}>; rel="prev"`;
    const nextPage = `</products?page=${page === numPages ? page : page + 1}&&limit=${limit}>; rel="next"`;

    resp.set('link', `${firstPage}, ${lastPage}, ${prevPage}, ${nextPage}`);

    resp.send(products);
  },
  controllerGetProductById: async (req, resp, next) => {
    try {
      const { productId } = req.params;
      const productIdDb = { _id: new ObjectId(productId) };
      const product = await productModel.searchDataBase(productIdDb);
      if (!product) {
        return next(404);
      }
      resp.send(product);
    } catch (error) {
      return next(404);
    }
  },
  controllerPutProduct: async (req, resp, next) => {
    try {
      const {
        name, price, image, type,
      } = req.body;
      const { productId } = req.params;
      const productIdDb = { _id: new ObjectId(productId) };
      if ((!name && !price && !image && !type) || (typeof price !== 'number')) {
        return next(400);
      }
      const product = await productModel.searchDataBase(productIdDb);
      if (!product) {
        return next(404);
      }
      await productModel.updateDocument(product._id, {
        name: name || product.name,
        price: price || product.price,
        image: image || product.image,
        type: type || product.type,
      });
      const updateProduct = await productModel.searchDataBase(productIdDb);
      return resp.send(updateProduct);
    } catch (error) {
      return next(404);
    }
  },
  controllerDeleteProduct: async (req, resp, next) => {
    try {
      const { productId } = req.params;
      const productIdDb = { _id: new ObjectId(productId) };
      const product = await productModel.searchDataBase(productIdDb);
      if (!product) {
        return next(404);
      }
      await productModel.deleteDocument(product._id);
      return resp.send(product);
    } catch (error) {
      return next(404);
    }
  },
});
