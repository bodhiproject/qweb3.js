const _ = require('lodash');

const HttpProvider = require('./httpprovider');
const Formatter = require('./formatter');

class Qweb3 {
  constructor(url) {
    this.provider = new HttpProvider(url);
  }

  /** ******** MISC ********* */
  /**
   * Checks if the blockchain is connected.
   * @return If blockchain is connected.
   */
  async isConnected() {
    try {
      const res = await this.provider.rawCall('getnetworkinfo');
      return typeof res === 'object';
    } catch (err) {
      return false;
    }
  }

  /** ******** BLOCKCHAIN ********* */
  /*
  * Returns the latest block info that is synced with the client.
  * @param blockHash {String} The block hash to look up.
  * @param verbose {Boolean} True for a json object or false for the hex encoded data.
  * @return {Promise} Latest block info or Error.
  */
  getBlock(blockHash, verbose = true) {
    return this.provider.request({
      method: 'getblock',
      params: [blockHash, verbose],
    });
  }

  /*
  * Returns the latest block info that is synced with the client.
  * @return {Promise} Latest block info or Error.
  */
  getBlockchainInfo() {
    return this.provider.request({
      method: 'getblockchaininfo',
    });
  }

  /*
  * Returns the current block height that is synced with the client.
  * @return {Promise} Current block count or Error.
  */
  getBlockCount() {
    return this.provider.request({
      method: 'getblockcount',
    });
  }

  /*
  * Returns the block hash of the block height number specified.
  * @param blockNum {Number} The block number to look up.
  * @return {Promise} Block hash or Error.
  */
  getBlockHash(blockNum) {
    return this.provider.request({
      method: 'getblockhash',
      params: [blockNum],
    });
  }

  /*
  * Returns the transaction receipt given the txid.
  * @param txid {String} The transaction id to look up.
  * @return {Promise} Transaction receipt or Error.
  */
  getTransactionReceipt(txid) {
    return this.provider.request({
      method: 'gettransactionreceipt',
      params: [txid],
    });
  }

  /*
  * Returns an array of deployed contract addresses.
  * @param startingAcctIndex {Number} The starting account index.
  * @param maxDisplay {Number} Max accounts to list.
  * @return {Promise} Array of contract addresses or Error.
  */
  listContracts(startingAcctIndex = 1, maxDisplay = 20) {
    return this.provider.rawCall('listcontracts', [startingAcctIndex, maxDisplay]);
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

  /** ******** CONTROL ********* */
  /**
   * Get the blockchain info.
   * @return {Promise} Blockchain info object or Error
   */
  getInfo() {
    return this.provider.request({
      method: 'getinfo',
    });
  }

  /** ******** NETWORK ********* */
  /**
   * Returns data about each connected network node as a json array of objects.
   * @return {Promise} Node info object or Error
   */
  getPeerInfo() {
    return this.provider.request({
      method: 'getpeerinfo',
    });
  }

  /** ******** RAW TRANSACTIONS ********* */
  /**
   * Get the hex address of a Qtum address.
   * @param address {String} Qtum address
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
   * @param hexAddress {String} Qtum address in hex format.
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
   * @param address {String} Qtum address to validate.
   * @return {Promise} Object with validation info or Error.
   */
  validateAddress(address) {
    return this.provider.request({
      method: 'validateaddress',
      params: [address],
    });
  }

  /** ******** WALLET ********* */
  /**
   * Backup the wallet
   * @param {String} destination The destination directory or file.
   * @return {Promise} Success or Error.
   */
  backupWallet(destination) {
    return this.provider.request({
      method: 'backupwallet',
      params: [destination],
    });
  }

  /*
  * Reveals the private key corresponding to the address.
  * @param address {String} The qtum address for the private key.
  * @return {Promise} Private key or Error.
  */
  dumpPrivateKey(address) {
    return this.provider.request({
      method: 'dumpprivkey',
      params: [address],
    });
  }

  /*
  * Encrypts the wallet for the first time. This will shut down the qtum server.
  * @param passphrase {String} The passphrase to encrypt the wallet with. Must be at least 1 character.
  * @return {Promise} Success or Error.
  */
  encryptWallet(passphrase) {
    return this.provider.request({
      method: 'encryptwallet',
      params: [passphrase],
    });
  }

  /*
  * Gets the account name associated with the Qtum address.
  * @param address {String} The qtum address for account lookup.
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
  * @param acctName {String} The account name for the address ("" for default).
  * @return {Promise} Qtum address or Error.
  */
  getAccountAddress(acctName = '') {
    return this.provider.request({
      method: 'getaccountaddress',
      params: [acctName],
    });
  }

  /*
  * Gets the Qtum address with the account name.
  * @param acctName {String} The account name ("" for default).
  * @return {Promise} Qtum address array or Error.
  */
  getAddressesByAccount(acctName = '') {
    return this.provider.request({
      method: 'getaddressesbyaccount',
      params: [acctName],
    });
  }

  /*
  * Gets a new Qtum address for receiving payments.
  * @param acctName {String} The account name for the address to be linked to ("" for default).
  * @return {Promise} Qtum address or Error.
  */
  getNewAddress(acctName = '') {
    return this.provider.request({
      method: 'getnewaddress',
      params: [acctName],
    });
  }

  /**
   * Get transaction details by txid
   * @param txid {string} The transaction id (64 char hex string).
   * @return {Promise} Promise containing result object or Error
   */
  getTransaction(txid) {
    return this.provider.request({
      method: 'gettransaction',
      params: [txid],
    });
  }

  /**
   * Gets the wallet info
   * @return {Promise} Promise containing result object or Error
   */
  getWalletInfo() {
    return this.provider.request({
      method: 'getwalletinfo',
    });
  }

  /*
  * Gets the total unconfirmed balance.
  * @return {Promise} Unconfirmed balance or Error.
  */
  getUnconfirmedBalance() {
    return this.provider.request({
      method: 'getunconfirmedbalance',
    });
  }

  /*
  * Adds an address that is watch-only. Cannot be used to spend.
  * @param address {String} The hex-encoded script (or address).
  * @param label {String} An optional label.
  * @param rescan {Boolean} Rescan the wallet for transactions.
  * @return {Promise} Success or Error.
  */
  importAddress(address, label = '', rescan = true) {
    return this.provider.request({
      method: 'importaddress',
      params: [address, label, rescan],
    });
  }

  /*
  * Adds an address by private key.
  * @param privateKey {String} The private key.
  * @param label {String} An optional label.
  * @param rescan {Boolean} Rescan the wallet for transactions.
  * @return {Promise} Success or Error.
  */
  importPrivateKey(privateKey, label = '', rescan = true) {
    return this.provider.request({
      method: 'importprivkey',
      params: [privateKey, label, rescan],
    });
  }

  /*
  * Adds an watch-only address by public key. Cannot be used to spend.
  * @param publicKey {String} The public key.
  * @param label {String} An optional label.
  * @param rescan {Boolean} Rescan the wallet for transactions.
  * @return {Promise} Success or Error.
  */
  importPublicKey(publicKey, label = '', rescan = true) {
    return this.provider.request({
      method: 'importpubkey',
      params: [publicKey, label, rescan],
    });
  }

  /**
   * Imports keys from a wallet dump file
   * @param {String} filename The wallet file.
   * @return {Promise} Success or Error.
   */
  importWallet(filename) {
    return this.provider.request({
      method: 'importwallet',
      params: [filename],
    });
  }

  /*
  * Lists groups of addresses which have had their common ownership made public by common use as inputs
  *   or as the resulting change in past transactions.
  * @return {Promise} Array of addresses with QTUM balances or Error.
  */
  listAddressGroupings() {
    return this.provider.request({
      method: 'listaddressgroupings',
    });
  }

  /*
  * Lists temporary unspendable outputs.
  * @return {Promise} Array of unspendable outputs or Error
  */
  listLockUnspent() {
    return this.provider.request({
      method: 'listlockunspent',
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

  /*
  * Lists unspent transaction outputs.
  * @param address {String} Address to send QTUM to.
  * @param amount {Number} Amount of QTUM to send.
  * @param comment {String} Comment used to store what the transaction is for.
  * @param commentTo {String} Comment to store name/organization to which you're sending the transaction.
  * @param subtractFeeFromAmount {Boolean} The fee will be deducted from the amount being sent.
  * @param replaceable {Boolean} Allow this transaction to be replaced by a transaction with higher fees via BIP 125.
  * @param confTarget {Number} Confirmation target (in blocks).
  * @param estimateMode {String} The fee estimate mode, must be one of: "UNSET", "ECONOMICAL", "CONSERVATIVE"
  * @param senderAddress {String} The QTUM address that will be used to send money from.
  * @param changeToSender {Boolean} Return the change to the sender.
  * @return {Promise} Transaction ID or Error
  */
  sendToAddress(
    address,
    amount,
    comment = '',
    commentTo = '',
    subtractFeeFromAmount = false,
    replaceable = true,
    confTarget = 6,
    estimateMode = 'UNSET',
    senderAddress,
    changeToSender = false,
  ) {
    return this.provider.request({
      method: 'sendtoaddress',
      params: [
        address,
        amount,
        comment,
        commentTo,
        subtractFeeFromAmount,
        replaceable,
        confTarget,
        estimateMode,
        senderAddress,
        changeToSender,
      ],
    });
  }

  /*
  * Set the transaction fee per kB. Overwrites the paytxfee parameter.
  * @param amount {Number} The transaction fee in QTUM/kB.
  * @return {Promise} True/false for success or Error.
  */
  setTxFee(amount) {
    return this.provider.request({
      method: 'settxfee',
      params: [amount],
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
  walletPassphrase(passphrase, timeout, stakingOnly = false) {
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

module.exports = Qweb3;
