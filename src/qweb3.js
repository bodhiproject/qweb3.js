// Internal Imports
const Qtum  = require('./qtum');
const HttpProvider = require('./httpprovider');
const Contract = require('./contract');
const Formatter = require('./formatter');

class Qweb3 {
  constructor(url) {
    const self = this;

    // TODO: url string validation
    this.provider = new HttpProvider(url);
    this.qtum = new Qtum(this);

    this.Contract = (address, abi) => new Contract(self, address, abi);
  }

  /**
   * Returns true if getinfo request returns result; otherwise false
   * @return {Boolean}
   */
  isConnected() {
    return this.provider.request({
      method: 'getinfo',
    })
      .then(res => Promise.resolve(!!res), err => Promise.resolve(false));
  }

  /**
   * Get the hex address of a Qtum address.
   * @param {address} Qtum address
   * @return {Promise} Hex string of the converted address or Error
   */
  getHexAddress(address) {
    return this.provider.request({
      method: 'gethexaddress',
      params: [address],
    });
  }

  /*
  * @dev Returns the current block height that is synced with the client.
  * @return {Promise} Current block count or Error.
  */
  getBlockCount() {
    return this.provider.request({
      method: 'getblockcount',
    });
  }

  /**
   * Get transaction details by txid
   * @param  {string} txid transaction Id (64 digits hexString),
   *                       e.g. dfafd59050fbe825d884b1e9279924f42bfa9506ca11e3d1910141054858f338
   * @return {Promise}     Promise containing result object or Error
   */
  getTransaction(txid) {
    return this.provider.request({
      method: 'gettransaction',
      params: [txid],
    });
  }

  /*
  * @dev Returns the transaction receipt given the txid.
  * @return {Promise} Transaction receipt or Error.
  */
  getTransactionReceipt(txid) {
    return this.provider.request({
      method: 'gettransactionreceipt',
      params: [txid],
    });
  }

  /*
  * Lists unspent transaction outputs.
  * @return {Promise} Array of unspent transaction outputs or Error
  */
  listUnspent() {
    return this.provider.request({
      method: 'listunspent',
    });
  }

  /**
   * Search logs with given filters
   * @param  {number} fromBlock Starting block to search.
   * @param  {number} toBlock Ending block to search. Use -1 for latest.
   * @param  {string or array} addresses One or more addresses to search against
   * @param  {string or array} topics One or more topic hashes to search against
   * @return {Promise} Promise containing returned logs or Error
   */
  searchLogs(fromBlock, toBlock, addresses, topics) {
    if (!_.isNumber(fromBlock)) {
      throw new Error(`fromBlock expects a number. Got ${fromBlock} instead.`);
    }
    if (!_.isNumber(toBlock)) {
      throw new Error(`toBlock expects a number. Got ${toBlock} instead.`);
    }

    const addrObj = { addresses: undefined };
    if (_.isString(addresses)) {
      addrObj.addresses = [addresses];
    } else if (_.isArray(addresses)) {
      addrObj.addresses = addresses;
    } else {
      throw new Error('addresses expects a string or an array.');
    }

    const topicsObj = { topics: undefined };
    if (_.isString(topics)) {
      topicsObj.topics = [topics];
    } else if (_.isArray(topics)) {
      topicsObj.topics = topics;
    } else {
      throw new Error('topics expects a string or an array.');
    }

    const options = {
      method: 'searchlogs',
      params: [
        fromBlock,
        toBlock,
        addrObj,
        topicsObj,
      ],
    };

    return this.parent.provider.request(options)
      .then((results) => Formatter.searchLogOutput(results));
  }
}

module.exports = Qweb3;
