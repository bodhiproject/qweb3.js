const _ = require('lodash');
require('dotenv').config();

// Testnet default config values
const Config = {
  QTUM_RPC_ADDRESS: 'http://bodhi:bodhi@localhost:13889',
  SENDER_ADDRESS: 'qMZK8FNPRm54jvTLAGEs1biTCgyCkcsmna',
  WALLET_PASSPHRASE: 'bodhi',
  NEW_ADDRESS_TESTS: false,
  WALLET_TESTS: false,
};

/* 
* Returns the default Qtum address.
* @return {String} Default Qtum address.
*/
function getDefaultQtumAddress() {
  return process.env.SENDER_ADDRESS ? String(new Buffer(process.env.SENDER_ADDRESS)) : Config.SENDER_ADDRESS;
}

/* 
* Returns the Qtum network RPC url.
* @return {String} The Qtum network RPC url.
*/
function getQtumRPCAddress() {
  return process.env.QTUM_RPC_ADDRESS ? String(new Buffer(process.env.QTUM_RPC_ADDRESS)) : Config.QTUM_RPC_ADDRESS;
}

/* 
* Returns the wallet passphrase to unlock the encrypted wallet.
* @return {String} The wallet passphrase.
*/
function getWalletPassphrase() {
  return process.env.WALLET_PASSPHRASE ? String(new Buffer(process.env.WALLET_PASSPHRASE)) : Config.WALLET_PASSPHRASE;
}

module.exports = {
  Config,
  getQtumRPCAddress,
  getDefaultQtumAddress,
  getWalletPassphrase,
};
