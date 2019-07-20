const { ObjectId } = require('mongodb');

module.exports = productModel => ({
  controllerCreateProduct: async (req, resp, next) => {
    const {
      name, price, image, type,
    } = req.body;

    if (!name || !price) {
      return next(400);
    }
    const newProduct = await productModel.createDocument({
      name, price, image, type, dateEntry: new Date(),
    });
    return resp.send({
      _id: newProduct.ops[0]._id,
      name: newProduct.ops[0].name,
      price: newProduct.ops[0].price,
      image: newProduct.ops[0].image,
      type: newProduct.ops[0].type,
      dateEntry: newProduct.ops[0].dateEntry,
    });
  },
  controllerPutProduct: async (req, resp, next) => {
    const {
      name, price, image, type,
    } = req.body;
    const { productId } = req.params;
    console.log(productId)
    let productIdDb;
    try {
      productIdDb = { _id: new ObjectId(productId) };
    } catch (error) {
      productIdDb = { _id: productId };
    }
    console.log(productIdDb)
    const product = await productModel.searchDataBase(productIdDb);
    if (!product) {
      return next(404);
    }
    if (!name || !price || !image || !type) {
      return next(400);
    }
    await productModel.updateDocument(product._id, {
      name: name || product.name,
      price: price || product.price,
      image: image || product.image,
      type: type || product.type,
    });
    const updateProduct = await productModel.searchDataBase(productIdDb);
    return resp.send({
      _id: updateProduct._id,
      name: updateProduct.name,
      price: updateProduct.price,
      image: updateProduct.image,
      type: updateProduct.type,
      dateEntry: updateProduct.dateEntry,
    });
  },
  controllerDeleteProduct: async (req, resp, next) => {
    const { productId } = req.params;
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
      image: product.image,
      type: product.type,
      dateEntry: product.dateEntry,
    });
  },
});
