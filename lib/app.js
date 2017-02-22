'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express2.default)();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const server = app.listen(8888, (...args) => {
  let { address, port } = server.address();
  console.log('http://%s:%s', address, port);
});