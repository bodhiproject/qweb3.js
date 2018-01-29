import _ from 'lodash';
import HttpProvider from './httpprovider';
import Formatter from './formatter';

class Qweb3 {
  constructor(url) {
    const self = this;
    // TODO: url string validation
    this.provider = new HttpProvider(url);
  }

  /** ******** MISC ********* */
  /**
   * Returns true if getinfo request returns result; otherwise false
   * @return {Boolean}
   */
  isConnected() {
    return this.provider.request({
      method: 'getinfo',
    }).then(res => Promise.resolve(!!res), err => Promise.resolve(false));
  }

  /** ******** BLOCKCHAIN ********* */
  /*
  * @dev Returns the latest block info that is synced with the client.
  * @return {Promise} Latest block info or Error.
  */
  getBlockchainInfo() {
    return this.provider.request({
      method: 'getblockchaininfo',
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
  searchLogs(fromBlock, toBlock, addresses, topics, contractMetadata, removeHexPrefix) {
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

    return this.provider.request(options)
      .then(results => Formatter.searchLogOutput(results, contractMetadata, removeHexPrefix));
  }

  /** ******** RAW TRANSACTIONS ********* */
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

  /**
   * Converts a hex address to qtum address.
   * @param {hexAddress} Qtum address in hex format.
   * @return {Promise} Qtum address or Error.
   */
  fromHexAddress(hexAddress) {
    return this.provider.request({
      method: 'fromhexaddress',
      params: [hexAddress],
    });
  }

  /** ******** UTIL ********* */
  /**
   * Validates if a valid Qtum address.
   * @param {address} Qtum address to validate.
   * @return {Promise} JSON payload with validation info or Error.
   */
  validateAddress(address) {
    return this.provider.request({
      method: 'validateaddress',
      params: [address],
    });
  }

  /** ******** WALLET ********* */
  /*
  * Gets the account name associated with the Qtum address.
  * @return {Promise} Account name or Error.
  */
  getAccount(address) {
    return this.provider.request({
      method: 'getaccount',
      params: [address],
    });
  }

  /*
  * Gets the Qtum address based on the account name.
  * @return {Promise} Qtum address or Error.
  */
  getAccountAddress(acctName) {
    return this.provider.request({
      method: 'getaccountaddress',
      params: [acctName],
    });
  }

  /*
  * Gets the Qtum address with the account name.
  * @return {Promise} Qtum address array or Error.
  */
  getAddressesByAccount(acctName) {
    return this.provider.request({
      method: 'getaddressesbyaccount',
      params: [acctName],
    });
  }

  /**
   * Get transaction details by txid
   * @param  {string} txid transaction Id (64 digits hexString);
   *  e.g. dfafd59050fbe825d884b1e9279924f42bfa9506ca11e3d1910141054858f338
   * @return {Promise} Promise containing result object or Error
   */
  getTransaction(txid) {
    return this.provider.request({
      method: 'gettransaction',
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
   * Locks the encrypted wallet.
   * @return {Promise} Success or Error.
   */
  walletLock() {
    return this.provider.request({
      method: 'walletlock',
      params: [],
    });
  }

  /**
   * Unlocks the encrypted wallet with the wallet passphrase.
   * @param {String} passphrase The wallet passphrase.
   * @param {Number} timeout The number of seconds to keep the wallet unlocked.
   * @param {Boolean} stakingOnly Unlock wallet for staking only.
   * @return {Promise} Success or Error.
   */
  walletPassphrase(passphrase, timeout, stakingOnly) {
    return this.provider.request({
      method: 'walletpassphrase',
      params: [
        passphrase,
        timeout,
        stakingOnly,
      ],
    });
  }

  /**
   * Changes the encrypted wallets passphrase.
   * @param {String} oldPassphrase The old wallet passphrase.
   * @param {String} newPassphrase The new wallet passphrase.
   * @return {Promise} Success or Error.
   */
  walletPassphraseChange(oldPassphrase, newPassphrase) {
    return this.provider.request({
      method: 'walletpassphrasechange',
      params: [
        oldPassphrase,
        newPassphrase,
      ],
    });
  }
}

export default Qweb3;
