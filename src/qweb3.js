/* Internal Import */
const Qtum  = require('./qtum');
const HttpProvider = require('./httpprovider');
const Contract = require('./contract');

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

  getBlockCount() {
    return this.provider.request({
      method: 'getblockcount',
    });
  }
}

module.exports = Qweb3;
