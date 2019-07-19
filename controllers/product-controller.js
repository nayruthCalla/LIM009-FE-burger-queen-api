const { ObjectId } = require('mongodb');

module.exports = productModdel => ({
  controllerCreateProducts: async (req, resp, next) => {
    const {
      name, price, image, type,
    } = req.body;

    if (!name || !price) {
      return next(400);
    }
    const newProduct = await productModdel.createDocument({
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
});
