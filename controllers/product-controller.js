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
      dataEntry: newProduct.ops[0].dateEntry,
    });
  },
  controllerGetProductById: async (req, resp, next) => {
    const { productId } = req.params;
    let search;
    try {
      search = { _id: new ObjectId(productId) };
    } catch (error) {
      return next(404);
    }
    const product = await productModel.searchDataBase(search);
    if (!product) {
      return next(404);
    }
    resp.send({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      type: product.type,
      dateEntry: product.dateEntry,
    });
  },
});
