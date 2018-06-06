const _ = require('lodash');
require('dotenv').config();

/* 
* Returns the default Qtum address.
* @return {String} Default Qtum address.
*/
function getDefaultQtumAddress() {
  if (!process.env.SENDER_ADDRESS) {
    throw Error('Must have SENDER_ADDRESS in .env');
  }
  return String(new Buffer(process.env.SENDER_ADDRESS));
}

/* 
* Returns the Qtum network RPC url.
* @return {String} The Qtum network RPC url.
*/
function getQtumRPCAddress() {
  if (!process.env.QTUM_RPC_ADDRESS) {
    throw Error('Must have QTUM_RPC_ADDRESS in .env');
  }
  return String(new Buffer(process.env.QTUM_RPC_ADDRESS)); 
}

/* 
* Returns the wallet passphrase to unlock the encrypted wallet.
* @return {String} The wallet passphrase.
*/
function getWalletPassphrase() {
  return process.env.WALLET_PASSPHRASE ? String(new Buffer(process.env.WALLET_PASSPHRASE)) : '';
}

module.exports = {
  getQtumRPCAddress,
  getDefaultQtumAddress,
  getWalletPassphrase,
};
