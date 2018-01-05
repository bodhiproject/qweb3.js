'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Utils = exports.Decoder = exports.Contract = undefined;

var _qweb = require('./qweb3');

var _qweb2 = _interopRequireDefault(_qweb);

var _contract = require('./contract');

var _contract2 = _interopRequireDefault(_contract);

var _decoder = require('./decoder');

var _decoder2 = _interopRequireDefault(_decoder);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// dont override global variable
if (typeof window !== 'undefined' && typeof window.Qweb3 === 'undefined') {
  window.Qweb3 = _qweb2.default;
}

exports.default = _qweb2.default;
exports.Contract = _contract2.default;
exports.Decoder = _decoder2.default;
exports.Utils = _utils2.default;