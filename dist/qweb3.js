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

  /** ******** MISC ********* */
  /*
   * Returns true if getinfo request returns result.
   * @return {Promise} True/false for connected or Error.
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

    /** ******** BLOCKCHAIN ********* */
    /*
    * Returns the latest block info that is synced with the client.
    * @param blockHash {String} The block hash to look up.
    * @param verbose {Boolean} True for a json object or false for the hex encoded data.
    * @return {Promise} Latest block info or Error.
    */

  }, {
    key: 'getBlock',
    value: function getBlock(blockHash) {
      var verbose = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      return this.provider.request({
        method: 'getblock',
        params: [blockHash, verbose]
      });
    }

    /*
    * Returns the latest block info that is synced with the client.
    * @return {Promise} Latest block info or Error.
    */

  }, {
    key: 'getBlockchainInfo',
    value: function getBlockchainInfo() {
      return this.provider.request({
        method: 'getblockchaininfo'
      });
    }

    /*
    * Returns the current block height that is synced with the client.
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
    * Returns the block hash of the block height number specified.
    * @param blockNum {Number} The block number to look up.
    * @return {Promise} Block hash or Error.
    */

  }, {
    key: 'getBlockHash',
    value: function getBlockHash(blockNum) {
      return this.provider.request({
        method: 'getblockhash',
        params: [blockNum]
      });
    }

    /*
    * Returns the transaction receipt given the txid.
    * @param txid {String} The transaction id to look up.
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

    /*
    * Returns an array of deployed contract addresses.
    * @param startingAcctIndex {Number} The starting account index.
    * @param maxDisplay {Number} Max accounts to list.
    * @return {Promise} Array of contract addresses or Error.
    */

  }, {
    key: 'listContracts',
    value: function listContracts() {
      var startingAcctIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var maxDisplay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 20;

      return this.provider.request({
        method: 'listcontracts'
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

    /** ******** CONTROL ********* */
    /**
     * Get the blockchain info.
     * @return {Promise} Blockchain info object or Error
     */

  }, {
    key: 'getInfo',
    value: function getInfo() {
      return this.provider.request({
        method: 'getinfo'
      });
    }

    /** ******** RAW TRANSACTIONS ********* */
    /**
     * Get the hex address of a Qtum address.
     * @param address {String} Qtum address
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
     * @param hexAddress {String} Qtum address in hex format.
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

    /** ******** UTIL ********* */
    /**
     * Validates if a valid Qtum address.
     * @param address {String} Qtum address to validate.
     * @return {Promise} Object with validation info or Error.
     */

  }, {
    key: 'validateAddress',
    value: function validateAddress(address) {
      return this.provider.request({
        method: 'validateaddress',
        params: [address]
      });
    }

    /** ******** WALLET ********* */
    /*
    * Reveals the private key corresponding to the address.
    * @param address {String} The qtum address for the private key.
    * @return {Promise} Private key or Error.
    */

  }, {
    key: 'dumpPrivateKey',
    value: function dumpPrivateKey(address) {
      return this.provider.request({
        method: 'dumpprivkey',
        params: [address]
      });
    }

    /*
    * Encrypts the wallet for the first time. This will shut down the qtum server.
    * @param passphrase {String} The passphrase to encrypt the wallet with. Must be at least 1 character.
    * @return {Promise} Success or Error.
    */

  }, {
    key: 'encryptWallet',
    value: function encryptWallet(passphrase) {
      return this.provider.request({
        method: 'encryptwallet',
        params: [passphrase]
      });
    }

    /*
    * Gets the account name associated with the Qtum address.
    * @param address {String} The qtum address for account lookup.
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
    * @param acctName {String} The account name for the address ("" for default).
    * @return {Promise} Qtum address or Error.
    */

  }, {
    key: 'getAccountAddress',
    value: function getAccountAddress() {
      var acctName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      return this.provider.request({
        method: 'getaccountaddress',
        params: [acctName]
      });
    }

    /*
    * Gets the Qtum address with the account name.
    * @param acctName {String} The account name ("" for default).
    * @return {Promise} Qtum address array or Error.
    */

  }, {
    key: 'getAddressesByAccount',
    value: function getAddressesByAccount() {
      var acctName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      return this.provider.request({
        method: 'getaddressesbyaccount',
        params: [acctName]
      });
    }

    /*
    * Gets a new Qtum address for receiving payments.
    * @param acctName {String} The account name for the address to be linked to ("" for default).
    * @return {Promise} Qtum address or Error.
    */

  }, {
    key: 'getNewAddress',
    value: function getNewAddress() {
      var acctName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      return this.provider.request({
        method: 'getnewaddress',
        params: [acctName]
      });
    }

    /**
     * Get transaction details by txid
     * @param txid {string} The transaction id (64 char hex string).
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
    * Gets the total unconfirmed balance.
    * @return {Promise} Unconfirmed balance or Error.
    */

  }, {
    key: 'getUnconfirmedBalance',
    value: function getUnconfirmedBalance() {
      return this.provider.request({
        method: 'getunconfirmedbalance'
      });
    }

    /*
    * Adds an address that is watch-only. Cannot be used to spend.
    * @param address {String} The hex-encoded script (or address).
    * @param label {String} An optional label.
    * @param rescan {Boolean} Rescan the wallet for transactions.
    * @return {Promise} Success or Error.
    */

  }, {
    key: 'importAddress',
    value: function importAddress(address) {
      var label = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var rescan = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.provider.request({
        method: 'importaddress',
        params: [address, label, rescan]
      });
    }

    /*
    * Adds an address by private key.
    * @param privateKey {String} The private key.
    * @param label {String} An optional label.
    * @param rescan {Boolean} Rescan the wallet for transactions.
    * @return {Promise} Success or Error.
    */

  }, {
    key: 'importPrivateKey',
    value: function importPrivateKey(privateKey) {
      var label = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var rescan = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.provider.request({
        method: 'importprivkey',
        params: [privateKey, label, rescan]
      });
    }

    /*
    * Adds an watch-only address by public key. Cannot be used to spend.
    * @param publicKey {String} The public key.
    * @param label {String} An optional label.
    * @param rescan {Boolean} Rescan the wallet for transactions.
    * @return {Promise} Success or Error.
    */

  }, {
    key: 'importPublicKey',
    value: function importPublicKey(publicKey) {
      var label = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var rescan = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.provider.request({
        method: 'importpubkey',
        params: [publicKey, label, rescan]
      });
    }

    /*
    * Lists temporary unspendable outputs.
    * @return {Promise} Array of unspendable outputs or Error
    */

  }, {
    key: 'listLockUnspent',
    value: function listLockUnspent() {
      return this.provider.request({
        method: 'listlockunspent'
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

    /*
    * Lists unspent transaction outputs.
    * @param address {String} Address to send QTUM to.
    * @param amount {Number} Amount of QTUM to send.
    * @param comment {String} Comment used to store what the transaction is for.
    * @param commentTo {String} Comment to store name/organization to which you're sending the transaction.
    * @param subtractFeeFromAmount {Boolean} The fee will be deducted from the amount being sent.
    * @return {Promise} Transaction ID or Error
    */

  }, {
    key: 'sendToAddress',
    value: function sendToAddress(address, amount) {
      var comment = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
      var commentTo = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
      var subtractFeeFromAmount = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

      return this.provider.request({
        method: 'sendtoaddress',
        params: [address, amount, comment, commentTo, subtractFeeFromAmount]
      });
    }

    /*
    * Set the transaction fee per kB. Overwrites the paytxfee parameter.
    * @param amount {Number} The transaction fee in QTUM/kB.
    * @return {Promise} True/false for success or Error.
    */

  }, {
    key: 'setTxFee',
    value: function setTxFee(amount) {
      return this.provider.request({
        method: 'settxfee',
        params: [amount]
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
    value: function walletPassphrase(passphrase, timeout) {
      var stakingOnly = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

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