'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Contract = exports.Qweb3 = undefined;

var _qweb = require('./qweb3');

var _qweb2 = _interopRequireDefault(_qweb);

var _contract = require('./contract');

var _contract2 = _interopRequireDefault(_contract);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// dont override global variable
if (typeof window !== 'undefined' && typeof window.Qweb3 === 'undefined') {
  window.Qweb3 = _qweb2.default;
}

exports.Qweb3 = _qweb2.default;
exports.Contract = _contract2.default;