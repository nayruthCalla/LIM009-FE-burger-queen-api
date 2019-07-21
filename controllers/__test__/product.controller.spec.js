const modelController = require('../product-controller');

jest.mock('../../models/general-model');
const model = require('../../models/general-model');

const productModel = model('products', 'default dbUrl');
const productController = modelController(userModel);