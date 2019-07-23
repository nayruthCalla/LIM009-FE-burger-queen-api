const modelController = require('../order-controller');
// const { ObjectId } = require('mongodb');
jest.mock('../../models/general-model');
const { orderModelGeneral } = require('../../models/general-model');

const orderModel = orderModelGeneral('users', 'dbUrl default');
// const bdProduc = () =>
const productModel = jest.fn((collection, dbUrl) => ({
  searchDataBase: jest.fn().mockImplementation(() => Promise.resolve({
    _id: '5d328d66976faf100edae191',
    name: 'hamburguesa gourmet',
    price: 6.7,
    image: 'http://localhost:8080/products/img/hamburguesa.png',
    type: 'combo',
    dateEntry: '2019-07-20T03:41:26.873Z',
  })),
}));

const product = productModel('lal', 'lalal')

const orderController = modelController(orderModel, product);
const req = {
  body: {
    userId: '5d2b074c8d949249fa60e5fe',
    client: 'nameclient',
    products: [{ product: '5d33722684d861448ac52d29', qty: 4 }],
  },
};
// function ReqBody(userId, client, products) {
//   this.userId = userId;
//   this.client = client;
//   this.products = products;
// }
const resp = {
  set: jest.fn((link, property) => `{${link}:${property}}`),
  send: jest.fn(json => json),
};
const next = jest.fn(code => code);

describe('ControllerGetAllorders', () => {
  it('Deberia mostrar 4 orderos ', async (done) => {
    const req = {
      query: { page: '1', limit: '4' },
    };
    const result = await orderController.controllerGetAllorders(req, resp, next);
    const headerLink = '{link:</orders?page=1&&limit=4>; rel="first", </orders?page=2&&limit=4>; rel="last", </orders?page=1&&limit=4>; rel="prev", </orders?page=2&&limit=4>; rel="next"}';
    expect(result).toHaveLength(4);
    expect(result[0].name).toBe('hamburguesa gourmet1');
    expect(result[3].name).toBe('hamburguesa gourmet4');
    expect(resp.set).toHaveReturnedWith(headerLink);
    done();
  });
});
describe('ControllerGetOrderById', () => {
  it('Deberia mostrar un orden', async (done) => {
    const req = {
      body: {
        userId: '5d2b074c8d949249fa60e5fe',
        client: 'nameclient',
        products: [{ product: '5d33722684d861448ac52d29', qty: 4 }],
        status: 'preparing',
        dateEntry: '2019-07-20T21:07:37.847Z',
      },
      params: { productId: '123' },
    };
    const result = await orderController.controllerGetOrderById(req, resp, next);
    expect(result.status).toBe('preparing');
    done();
  });
  it('Deberia retornar 404 si no encuentra el orden ', async (done) => {
    const req = {
      body: {
        userId: '5d2b074c8d949249fa60e5fe',
        client: 'nameclient',
        products: [{ product: '5d33722684d861448ac52d29', qty: 4 }],
        status: 'canceled',
        dateEntry: '2019-07-20T21:07:37.847Z',
      },
    };
    const result = await orderController.controllerGetOrderById(req, resp, next);
    expect(result).toBe(404);
    done();
  });
});
describe('ControllerCreateOrder', () => {
  it('Deberia retornar 400 si no se ingresa ningun dato  ', async (done) => {
    const req = {
      body: {
        userId: '',
        client: '',
        products: [],
      },
    };
    const result = await orderController.controllerCreateOrder(req, resp, next);
    expect(result).toBe(400);
    done();
  });
  it('Deberia crear una orden', async (done) => {
    const req = {
      body: {
        userId: '5d2b074c8d949249fa60e5fe',
        client: 'nameclient',
        products: [{ product: '5d33722684d861448ac52d29', qty: 4 }],
        status: 'preparing',
        dateEntry: '2019-07-20T21:07:37.847Z',
      },
      params: { productId: '123' },
    };
    const result = await orderController.controllerCreateOrder(req, resp, next);
    expect(result.status).toBe('pending');
    done();
  });
  it('Deberia retornar 404 si no exite el id', async (done) => {
    const req = {
      body: {
        userId: '5d2b074c8d949249fa60e5fe',
        client: 'nameclient',
        products: [{ product: '5d33722684d861448ac52d29', qty: 4 }],
        status: 'canceled',
        dateEntry: '2019-07-20T21:07:37.847Z',
      },
      params: { productId: '123' },
    };
    const result = await orderController.controllerPutOrderById(req, resp, next);
    expect(result).toBe(404);
    done();
  });
});
describe('ControllerUpdateOrder', () => {
  it('Deberia actualizar una orden', async (done) => {
    const req = {
      body: {
        userId: '5d2b074c8d949249fa60e5fe',
        client: 'nameclient',
        products: [{ product: '5d33722684d861448ac52d29', qty: 4 }],
        status: 'preparing',
        dateEntry: '2019-07-20T21:07:37.847Z',
      },
      params: { productId: '123' },
    };
    const result = await orderController.controllerPutOrderById(req, resp, next);
    expect(result.status).toBe('preparing');
    done();
  });  
  it('Deberia retornar 400 si no se ingresa nungun dato', async (done) => {
    const req = {
      body: {},
      params: { orderId: '123' },
    };
    const result = await orderController.controllerPutOrderById(req, resp, next);
    expect(result).toBe(400);
    done();
  });
//   it('Deberia retornar 404 si no encuentra la orden para actualizar ', async (done) => {
//     const req = {
//       body: {
//         userId: '5d2b074c8d949249fa60e5fe',
//         client: 'nameclient',
//         products: [{ product: '5d33722684d861448ac52d29', qty: 4 }],
//         status: 'canceled',
//         dateEntry: '2019-07-20T21:07:37.847Z',
//       },
//       params: { orderId: '123' },
//     };
//     const result = await orderController.controllerDeleteOrderById(req, resp, next);
//     expect(result.status).toBe(404);
//     done();
//   });
});
describe('ControllerDeleteorder', () => {
  it('Deberia eliminar una orden', async (done) => {
    const req = {
      params: { orderId: '123' },
    };
    const result = await orderController.controllerDeleteOrderById(req, resp, next);
    expect(result.status).toBe('preparing');
    done();
  });
//   it('Deberia retornar 404 si no encuentra una orden a eliminar ', async (done) => {
//     const req = {
//       body: {},
//       params: { orderId: undefined },
//     };
//     const result = await orderController.controllerDeleteOrderById(req, resp, next);
//     expect(result.status).toBe(404);
//     done();
//   });
});
