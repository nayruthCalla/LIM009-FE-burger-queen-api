const { ObjectId } = require('mongodb');

module.exports = productModel => ({
  controllerPutUserById: async (req, resp, next) => {
    const {
      name, price, imagen, type,
    } = req.body;
    const productId = req.params.uid;
    let productIdDb;
    try {
      productIdDb = { _id: new ObjectId(productId) };
    } catch (error) {
      productIdDb = { _id: productId };
    }
    const product = await productModel.searchDataBase(productIdDb);
    if (!product) {
      return next(404);
    }
    if (!name && !price && !imagen && !type) {
      return next(400);
    }
    const updateProduct = await productModel.searchDataBase(productIdDb);
    return resp.send({
      _id: updateProduct._id,
      name: updateProduct.name,
      price: updateProduct.price,
      imagen: updateProduct.imagen,
      type: updateProduct.type,
      dateEntry: updateProduct.dateEntry,
    });
  },
  controllerDeleteUserById: async (req, resp, next) => {
    const productId = req.params.uid;
    let productIdDb;
    try {
      productIdDb = { _id: new ObjectId(productId) };
    } catch (error) {
      productIdDb = { _id: productId };
    }
    const product = await productModel.searchDataBase(productIdDb);
    if (!product) {
      return next(404);
    }
    return resp.send({
      _id: product._id,
      name: product.name,
      price: product.price,
      imagen: product.imagen,
      type: product.type,
      dateEntry: product.dateEntry,
    });
  },
});
