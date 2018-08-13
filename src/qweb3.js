const _ = require('lodash');

const { initProvider } = require('./providers');
const Contract = require('./contract');
const HttpProvider = require('./providers/http-provider');
const Encoder = require('./formatters/encoder');
const Decoder = require('./formatters/decoder');
const Formatter = require('./formatters/formatter');

class Qweb3 {
  /**
   * Qweb3 constructor.
   * @param {string|Qweb3Provider} provider Either URL string to create HttpProvider or a Qweb3 compatible provider.
   */
  constructor(provider) {
    this.provider = initProvider(provider);
    this.encoder = new Encoder();
    this.decoder = new Decoder();
  }

  /**
   * Constructs a new Contract instance.
   * @param {string} address Address of the contract.
   * @param {array} abi ABI of the contract.
   */
  Contract(address, abi) {
    return new Contract(this.provider, address, abi);
  }

  /**
   * Constructs a new HttpProvider instance.
   * @param {string} urlString URL of the blockchain API. eg. http://bodhi:bodhi@127.0.0.1:13889
   */
  HttpProvider(urlString) {
    return new HttpProvider(urlString);
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
  /**
   * Returns the block info for a given block hash.
   * @param {string} blockHash The block hash to look up.
   * @param {boolean} verbose True for a json object or false for the hex encoded data.
   * @return {Promise} Latest block info or Error.
   */
  getBlock(blockHash, verbose = true) {
    return this.provider.rawCall('getblock', [blockHash, verbose]);
  }

  /**
   * Returns various state info regarding blockchain processing.
   * @return {Promise} Latest block info or Error.
   */
  getBlockchainInfo() {
    return this.provider.rawCall('getblockchaininfo');
  }

  /**
   * Returns the current block height that is synced.
   * @return {Promise} Current block count or Error.
   */
  getBlockCount() {
    return this.provider.rawCall('getblockcount');
  }

  /**
   * Returns the block hash of the block height number specified.
   * @param {number} blockNum The block number to look up.
   * @return {Promise} Block hash or Error.
   */
  getBlockHash(blockNum) {
    return this.provider.rawCall('getblockhash', [blockNum]);
  }

  /**
   * Returns the transaction receipt given the txid.
   * @param {string} txid The transaction id to look up.
   * @return {Promise} Transaction receipt or Error.
   */
  getTransactionReceipt(txid) {
    return this.provider.rawCall('gettransactionreceipt', [txid]);
  }

  /**
   * Returns an array of deployed contract addresses.
   * @param {number} startingAcctIndex The starting account index.
   * @param {number} maxDisplay Max accounts to list.
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

    return this.provider.rawCall('searchlogs', [fromBlock, toBlock, addrObj, topicsObj])
      .then(results => Formatter.searchLogOutput(results, contractMetadata, removeHexPrefix));
  }

  /** ******** CONTROL ********* */
  /**
   * Get the blockchain info.
   * @return {Promise} Blockchain info object or Error
   */
  getInfo() {
    return this.provider.rawCall('getinfo');
  }

  /** ******** NETWORK ********* */
  /**
   * Returns data about each connected network node as a json array of objects.
   * @return {Promise} Node info object or Error
   */
  getPeerInfo() {
    return this.provider.rawCall('getpeerinfo');
  }

  /** ******** RAW TRANSACTIONS ********* */
  /**
   * Get the hex address of a Qtum address.
   * @param {string} address Qtum address
   * @return {Promise} Hex string of the converted address or Error
   */
  getHexAddress(address) {
    return this.provider.rawCall('gethexaddress', [address]);
  }

  /**
   * Converts a hex address to qtum address.
   * @param {string} hexAddress Qtum address in hex format.
   * @return {Promise} Qtum address or Error.
   */
  fromHexAddress(hexAddress) {
    return this.provider.rawCall('fromhexaddress', [hexAddress]);
  }

  /** ******** UTIL ********* */
  /**
   * Validates if a valid Qtum address.
   * @param {string} address Qtum address to validate.
   * @return {Promise} Object with validation info or Error.
   */
  validateAddress(address) {
    return this.provider.rawCall('validateaddress', [address]);
  }

  /** ******** WALLET ********* */
  /**
   * Backs up the wallet.
   * @param {string} destination The destination directory or file.
   * @return {Promise} Success or Error.
   */
  backupWallet(destination) {
    return this.provider.rawCall('backupwallet', [destination]);
  }

  /**
   * Reveals the private key corresponding to the address.
   * @param {string} address The qtum address for the private key.
   * @return {Promise} Private key or Error.
   */
  dumpPrivateKey(address) {
    return this.provider.rawCall('dumpprivkey', [address]);
  }

  /**
   * Encrypts the wallet for the first time. This will shut down the qtum server.
   * @param {string} passphrase The passphrase to encrypt the wallet with. Must be at least 1 character.
   * @return {Promise} Success or Error.
   */
  encryptWallet(passphrase) {
    return this.provider.rawCall('encryptwallet', [passphrase]);
  }

  /**
   * Gets the account name associated with the Qtum address.
   * @param {string} address The qtum address for account lookup.
   * @return {Promise} Account name or Error.
   */
  getAccount(address) {
    return this.provider.rawCall('getaccount', [address]);
  }

  /**
   * Gets the Qtum address based on the account name.
   * @param {string} acctName The account name for the address ("" for default).
   * @return {Promise} Qtum address or Error.
   */
  getAccountAddress(acctName = '') {
    return this.provider.rawCall('getaccountaddress', [acctName]);
  }

  /**
   * Gets the Qtum address with the account name.
   * @param {string} acctName The account name ("" for default).
   * @return {Promise} Qtum address array or Error.
   */
  getAddressesByAccount(acctName = '') {
    return this.provider.rawCall('getaddressesbyaccount', [acctName]);
  }

  /**
   * Gets a new Qtum address for receiving payments.
   * @param {string} acctName The account name for the address to be linked to ("" for default).
   * @return {Promise} Qtum address or Error.
   */
  getNewAddress(acctName = '') {
    return this.provider.rawCall('getnewaddress', [acctName]);
  }

  /**
   * Get transaction details by txid
   * @param {string} txid The transaction id (64 char hex string).
   * @return {Promise} Promise containing result object or Error
   */
  getTransaction(txid) {
    return this.provider.rawCall('gettransaction', [txid]);
  }

  /**
   * Gets the wallet info
   * @return {Promise} Promise containing result object or Error
   */
  getWalletInfo() {
    return this.provider.rawCall('getwalletinfo');
  }

  /**
   * Gets the total unconfirmed balance.
   * @return {Promise} Unconfirmed balance or Error.
   */
  getUnconfirmedBalance() {
    return this.provider.rawCall('getunconfirmedbalance');
  }

  /**
   * Adds an address that is watch-only. Cannot be used to spend.
   * @param {string} address The hex-encoded script (or address).
   * @param {string} label An optional label.
   * @param {boolean} rescan Rescan the wallet for transactions.
   * @return {Promise} Success or Error.
   */
  importAddress(address, label = '', rescan = true) {
    return this.provider.rawCall('importaddress', [address, label, rescan]);
  }

  /**
   * Adds an address by private key.
   * @param {string} privateKey The private key.
   * @param {string} label An optional label.
   * @param {boolean} rescan Rescan the wallet for transactions.
   * @return {Promise} Success or Error.
   */
  importPrivateKey(privateKey, label = '', rescan = true) {
    return this.provider.rawCall('importprivkey', [privateKey, label, rescan]);
  }

  /**
   * Adds an watch-only address by public key. Cannot be used to spend.
   * @param {string} publicKey The public key.
   * @param {string} label An optional label.
   * @param {boolean} rescan Rescan the wallet for transactions.
   * @return {Promise} Success or Error.
   */
  importPublicKey(publicKey, label = '', rescan = true) {
    return this.provider.rawCall('importpubkey', [publicKey, label, rescan]);
  }

  /**
   * Imports keys from a wallet dump file
   * @param {string} filename The wallet file.
   * @return {Promise} Success or Error.
   */
  importWallet(filename) {
    return this.provider.rawCall('importwallet', [filename]);
  }

  /**
   * Lists groups of addresses which have had their common ownership made public by common use as inputs
   *  or as the resulting change in past transactions.
   * @return {Promise} Array of addresses with QTUM balances or Error.
   */
  listAddressGroupings() {
    return this.provider.rawCall('listaddressgroupings');
  }

  /**
   * Lists temporary unspendable outputs.
   * @return {Promise} Array of unspendable outputs or Error
   */
  listLockUnspent() {
    return this.provider.rawCall('listlockunspent');
  }

  /**
   * Lists unspent transaction outputs.
   * @return {Promise} Array of unspent transaction outputs or Error
   */
  listUnspent() {
    return this.provider.rawCall('listunspent');
  }

  /**
   * Lists unspent transaction outputs.
   * @param {string} address Address to send QTUM to.
   * @param {number} amount Amount of QTUM to send.
   * @param {string} comment Comment used to store what the transaction is for.
   * @param {string} commentTo Comment to store name/organization to which you're sending the transaction.
   * @param {boolean} subtractFeeFromAmount The fee will be deducted from the amount being sent.
   * @param {boolean} replaceable Allow this transaction to be replaced by a transaction with higher fees via BIP 125.
   * @param {number} confTarget Confirmation target (in blocks).
   * @param {string} estimateMode The fee estimate mode, must be one of: "UNSET", "ECONOMICAL", "CONSERVATIVE"
   * @param {string} senderAddress The QTUM address that will be used to send money from.
   * @param {boolean} changeToSender Return the change to the sender.
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
    return this.provider.rawCall('sendtoaddress', [
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
    ]);
  }

  /**
   * Set the transaction fee per kB. Overwrites the paytxfee parameter.
   * @param {bumber} amount The transaction fee in QTUM/kB.
   * @return {Promise} True/false for success or Error.
   */
  setTxFee(amount) {
    return this.provider.rawCall('settxfee', [amount]);
  }

  /**
   * Locks the encrypted wallet.
   * @return {Promise} Success or Error.
   */
  walletLock() {
    return this.provider.rawCall('walletlock');
  }

  /**
   * Unlocks the encrypted wallet with the wallet passphrase.
   * @param {string} passphrase The wallet passphrase.
   * @param {number} timeout The number of seconds to keep the wallet unlocked.
   * @param {boolean} stakingOnly Unlock wallet for staking only.
   * @return {Promise} Success or Error.
   */
  walletPassphrase(passphrase, timeout, stakingOnly = false) {
    return this.provider.rawCall('walletpassphrase', [passphrase, timeout, stakingOnly]);
  }

  /**
   * Changes the encrypted wallets passphrase.
   * @param {string} oldPassphrase The old wallet passphrase.
   * @param {string} newPassphrase The new wallet passphrase.
   * @return {Promise} Success or Error.
   */
  walletPassphraseChange(oldPassphrase, newPassphrase) {
    return this.provider.rawCall('walletpassphrasechange', [oldPassphrase, newPassphrase]);
  }
}

module.exports = Qweb3;
