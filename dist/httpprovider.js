'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utils = require('./utils.js');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HttpProvider = function () {
  function HttpProvider(urlString) {
    _classCallCheck(this, HttpProvider);

    this.url = _url2.default.parse(urlString);
    this.reqId = 0;
  }

  _createClass(HttpProvider, [{
    key: 'request',
    value: function request(params) {
      // Make sure method is defined in params
      _utils2.default.paramsCheck('request', params, ['method']);

      // Construct body of request options
      var bodyJson = _lodash2.default.extend({
        id: this.reqId,
        jsonrpc: '1.0',
        method: '',
        params: []
      }, params);

      // Construct options of request
      var reqOpts = {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain'
        },
        body: JSON.stringify(bodyJson)
      };

      // Add Basic Auth header if auth is defined in HttpProvider constructor
      if (this.url.auth) {
        reqOpts.headers.Authorization = 'Basic ' + Buffer.from(this.url.auth).toString('base64');
      }

      this.reqId += 1;

      return (0, _nodeFetch2.default)(this.url.protocol + '//' + this.url.host, reqOpts).then(this.parseJSON).then(this.checkStatus);
    }

    /**
     * Returns resolved Promise if Http response contains result; otherwise returns rejected upon error.
     * @param {object} response JSON response from a HTTP request
     * @return {object|undefined} Returns either the response, or throws an error
     */

  }, {
    key: 'checkStatus',
    value: function checkStatus(response) {
      // We can rely on checking error object so dont check HTTP status code here.
      if (response.error) {
        throw new Error(response.error.message);
      } else {
        return response.result;
      }
    }

    /**
     * Parses the JSON returned by a network request
     * @param  {object} response A response from a network request
     * @return {object} The parsed JSON from the request
     */

  }, {
    key: 'parseJSON',
    value: function parseJSON(response) {
      return response.json();
    }
  }]);

  return HttpProvider;
}();

module.exports = HttpProvider;