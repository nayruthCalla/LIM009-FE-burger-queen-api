const modelController = require('../product-controller');

jest.mock('../../models/general-model');
const { productModelGeneral } = require('../../models/general-model');

const productModel = productModelGeneral('users', 'dbUrl default');


const productController = modelController(productModel);

function ReqBody(name, price, image, type) {
  this.name = name;
  this.price = price;
  this.image = image;
  this.type = type;
}

const resp = {
  set: jest.fn((link, property) => `{${link}:${property}}`),
  send: jest.fn(json => json),
};
const next = jest.fn(code => code);

describe('ControllerGetAllProducts', () => {
  it('Deberia mostrar 4 productos ', async (done) => {
    const req = {
      query: { page: '1', limit: '4' },
    };
    const result = await productController.controllerGetAllProducts(req, resp, next);
    const headerLink = '{link:</products?page=1&&limit=4>; rel="first", </products?page=2&&limit=4>; rel="last", </products?page=1&&limit=4>; rel="prev", </products?page=2&&limit=4>; rel="next"}';
    expect(result).toHaveLength(4);
    expect(result[0].name).toBe('hamburguesa gourmet1');
    expect(result[3].name).toBe('hamburguesa gourmet4');
    expect(resp.set).toHaveReturnedWith(headerLink);
    done();
  });
});
describe('ControllerGetProductById', () => {
  it('Deberia mostrar un producto', async (done) => {
    const req = {
      params: { productId: '5d328d66976faf100edae191' },
    };
    const result = await productController.controllerGetProductById(req, resp, next);
    expect(result.name).toBe('hamburguesa gourmet');
    done();
  });
  it('Deberia retornar 404 si no encuentra el producto ', async (done) => {
    const req = {
      params: { productId: '5d33f660cec98449ac6c1e86' },
    };
    const result = await productController.controllerGetProductById(req, resp, next);
    expect(result).toBe(404);
    done();
  });
});
describe('ControllerCreateProduct', () => {
  it('Deberia crear un producto ', async (done) => {
    const req = {
      body: new ReqBody('hamburguesa', 6.7, 'http://localhost:8080/products/img/hamburguesa.png', 'frituras'),
    };
    const product = await productController.controllerCreateProduct(req, resp, next);
    expect(product._id).toBe('5d328d66976faf100edae191');
    done();
  });
  it('Deberia retornar 400 si no se ingresa ningun dato  ', async (done) => {
    const req = {
      body: new ReqBody('6.7', 'http://localhost:8080/products/img/hamburguesa.png', 'frituras'),
    };
    const result = await productController.controllerCreateProduct(req, resp, next);
    expect(result).toBe(400);
    done();
  });
});
describe('ControllerUpdateProduct', () => {
  it('Deberia actualizar un producto', async (done) => {
    const req = {
      body: { name: 'hamburguesa gourmet', type: 'combo' },
      params: { productId: '5d328d66976faf100edae191' },
    };
    const result = await productController.controllerPutProduct(req, resp, next);
    expect(result.name).toBe('hamburguesa gourmet');
    done();
  });
  it('Deberia retornar 400 si typeof de price es diferente de number', async (done) => {
    const req = {
      body: { name: 'hamburguesa gourmet', price: '7.8' },
      params: { productId: '5d328d66976faf100edae191' },
    };
    const result = await productController.controllerPutProduct(req, resp, next);
    expect(result).toBe(400);
    done();
  });
  it('Deberia retornar 400 si no se ingresa nungun dato', async (done) => {
    const req = {
      body: {},
      params: { productId: '5d328d66976faf100edae191' },
    };
    const result = await productController.controllerPutProduct(req, resp, next);
    expect(result).toBe(400);
    done();
  });
  it('Deberia retornar 404 si no encuentra producto a actualizar ', async (done) => {
    const req = {
      body: { name: 'hamburguesa gourmet', price: 7.8 },
      params: { productId: '5d33f660cec98449ac6c1e86' },
    };
    const result = await productController.controllerPutProduct(req, resp, next);
    expect(result).toBe(404);
    done();
  });
});
describe('ControllerDeleteProduct', () => {
  it('Deberia eliminar un producto', async (done) => {
    const req = {
      params: { productId: '5d328d66976faf100edae191' },
    };
    const result = await productController.controllerDeleteProduct(req, resp, next);
    expect(result.name).toBe('hamburguesa gourmet');
    done();
  });
  it('Deberia retornar 404 si no encuentra producto a eliminar ', async (done) => {
    const req = {
      params: { productId: '5d33f660cec98449ac6c1e86' },
    };
    const result = await productController.controllerDeleteProduct(req, resp, next);
    expect(result).toBe(404);
    done();
  });
});
