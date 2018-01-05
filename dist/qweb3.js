'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _httpprovider = require('./httpprovider');

var _httpprovider2 = _interopRequireDefault(_httpprovider);

var _formatter = require('./formatter');

var _formatter2 = _interopRequireDefault(_formatter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Qweb3 = function () {
  function Qweb3(url) {
    _classCallCheck(this, Qweb3);

    var self = this;
    // TODO: url string validation
    this.provider = new _httpprovider2.default(url);
  }

  /********** MISC **********/
  /**
   * Returns true if getinfo request returns result; otherwise false
   * @return {Boolean}
   */


  _createClass(Qweb3, [{
    key: 'isConnected',
    value: function isConnected() {
      return this.provider.request({
        method: 'getinfo'
      }).then(function (res) {
        return Promise.resolve(!!res);
      }, function (err) {
        return Promise.resolve(false);
      });
    }

    /********** BLOCKCHAIN **********/
    /*
    * @dev Returns the current block height that is synced with the client.
    * @return {Promise} Current block count or Error.
    */

  }, {
    key: 'getBlockCount',
    value: function getBlockCount() {
      return this.provider.request({
        method: 'getblockcount'
      });
    }

    /*
    * @dev Returns the transaction receipt given the txid.
    * @return {Promise} Transaction receipt or Error.
    */

  }, {
    key: 'getTransactionReceipt',
    value: function getTransactionReceipt(txid) {
      return this.provider.request({
        method: 'gettransactionreceipt',
        params: [txid]
      });
    }

    /**
     * Search logs with given filters
     * @param  {number} fromBlock Starting block to search.
     * @param  {number} toBlock Ending block to search. Use -1 for latest.
     * @param  {string or array} addresses One or more addresses to search against
     * @param  {string or array} topics One or more topic hashes to search against
     * @param  {object} contractMetadata Metadata of all contracts and their events with topic hashes
     * @param  {bool} removeHexPrefix Flag to indicate whether to remove the hex prefix (0x) from hex values
     * @return {Promise} Promise containing returned logs or Error
     */

  }, {
    key: 'searchLogs',
    value: function searchLogs(fromBlock, toBlock, addresses, topics, contractMetadata, removeHexPrefix) {
      if (!_lodash2.default.isNumber(fromBlock)) {
        throw new Error('fromBlock expects a number. Got ' + fromBlock + ' instead.');
      }
      if (!_lodash2.default.isNumber(toBlock)) {
        throw new Error('toBlock expects a number. Got ' + toBlock + ' instead.');
      }

      var addrObj = { addresses: undefined };
      if (_lodash2.default.isString(addresses)) {
        addrObj.addresses = [addresses];
      } else if (_lodash2.default.isArray(addresses)) {
        addrObj.addresses = addresses;
      } else {
        throw new Error('addresses expects a string or an array.');
      }

      var topicsObj = { topics: undefined };
      if (_lodash2.default.isString(topics)) {
        topicsObj.topics = [topics];
      } else if (_lodash2.default.isArray(topics)) {
        topicsObj.topics = topics;
      } else {
        throw new Error('topics expects a string or an array.');
      }

      var options = {
        method: 'searchlogs',
        params: [fromBlock, toBlock, addrObj, topicsObj]
      };

      return this.provider.request(options).then(function (results) {
        return _formatter2.default.searchLogOutput(results, contractMetadata, removeHexPrefix);
      });
    }

    /********** RAW TRANSACTIONS **********/
    /**
     * Get the hex address of a Qtum address.
     * @param {address} Qtum address
     * @return {Promise} Hex string of the converted address or Error
     */

  }, {
    key: 'getHexAddress',
    value: function getHexAddress(address) {
      return this.provider.request({
        method: 'gethexaddress',
        params: [address]
      });
    }

    /**
     * Converts a hex address to qtum address.
     * @param {hexAddress} Qtum address in hex format.
     * @return {Promise} Qtum address or Error.
     */

  }, {
    key: 'fromHexAddress',
    value: function fromHexAddress(hexAddress) {
      return this.provider.request({
        method: 'fromhexaddress',
        params: [hexAddress]
      });
    }

    /********** UTIL **********/
    /**
     * Validates if a valid Qtum address.
     * @param {address} Qtum address to validate.
     * @return {Promise} JSON payload with validation info or Error.
     */

  }, {
    key: 'validateAddress',
    value: function validateAddress(address) {
      return this.provider.request({
        method: 'validateaddress',
        params: [address]
      });
    }

    /********** WALLET **********/
    /*
    * Gets the account name associated with the Qtum address.
    * @return {Promise} Account name or Error.
    */

  }, {
    key: 'getAccount',
    value: function getAccount(address) {
      return this.provider.request({
        method: 'getaccount',
        params: [address]
      });
    }

    /*
    * Gets the Qtum address based on the account name.
    * @return {Promise} Qtum address or Error.
    */

  }, {
    key: 'getAccountAddress',
    value: function getAccountAddress(acctName) {
      return this.provider.request({
        method: 'getaccountaddress',
        params: [acctName]
      });
    }

    /*
    * Gets the Qtum address with the account name.
    * @return {Promise} Qtum address array or Error.
    */

  }, {
    key: 'getAddressesByAccount',
    value: function getAddressesByAccount(acctName) {
      return this.provider.request({
        method: 'getaddressesbyaccount',
        params: [acctName]
      });
    }

    /**
     * Get transaction details by txid
     * @param  {string} txid transaction Id (64 digits hexString); 
     *  e.g. dfafd59050fbe825d884b1e9279924f42bfa9506ca11e3d1910141054858f338
     * @return {Promise} Promise containing result object or Error
     */

  }, {
    key: 'getTransaction',
    value: function getTransaction(txid) {
      return this.provider.request({
        method: 'gettransaction',
        params: [txid]
      });
    }

    /*
    * Lists unspent transaction outputs.
    * @return {Promise} Array of unspent transaction outputs or Error
    */

  }, {
    key: 'listUnspent',
    value: function listUnspent() {
      return this.provider.request({
        method: 'listunspent'
      });
    }

    /**
     * Locks the encrypted wallet.
     * @return {Promise} Success or Error.
     */

  }, {
    key: 'walletLock',
    value: function walletLock() {
      return this.provider.request({
        method: 'walletlock',
        params: []
      });
    }

    /**
     * Unlocks the encrypted wallet with the wallet passphrase.
     * @param {String} passphrase The wallet passphrase.
     * @param {Number} timeout The number of seconds to keep the wallet unlocked.
     * @param {Boolean} stakingOnly Unlock wallet for staking only.
     * @return {Promise} Success or Error.
     */

  }, {
    key: 'walletPassphrase',
    value: function walletPassphrase(passphrase, timeout, stakingOnly) {
      return this.provider.request({
        method: 'walletpassphrase',
        params: [passphrase, timeout, stakingOnly]
      });
    }

    /**
     * Changes the encrypted wallets passphrase.
     * @param {String} oldPassphrase The old wallet passphrase.
     * @param {String} newPassphrase The new wallet passphrase.
     * @return {Promise} Success or Error.
     */

  }, {
    key: 'walletPassphraseChange',
    value: function walletPassphraseChange(oldPassphrase, newPassphrase) {
      return this.provider.request({
        method: 'walletpassphrasechange',
        params: [oldPassphrase, newPassphrase]
      });
    }
  }]);

  return Qweb3;
}();

exports.default = Qweb3;