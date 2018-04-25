const _ = require('lodash');

// Load environment variables
require('dotenv').config();

const Config = {
  QTUM_RPC_ADDRESS: 'http://bodhi:bodhi@localhost:13889',
  SENDER_ADDRESS: 'qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy',
  NEW_ADDRESS_TESTS: false,
  WALLET_TESTS: false,
};

const qtumRPCAddress = 'QTUM_RPC_ADDRESS' in process.env ? String(new Buffer(process.env.QTUM_RPC_ADDRESS)) : undefined;
const qtumAddress = 'SENDER_ADDRESS' in process.env ? String(new Buffer(process.env.SENDER_ADDRESS)) : undefined;

/* Returns the default Qtum address
 * @return {String} default Qtum address.
 */
function getDefaultQtumAddress() {
  if (_.isUndefined(qtumAddress)) {
    return Config.SENDER_ADDRESS;
  }
  return qtumAddress;
}

/* Returns the Qtum network RPC url
 * @return {String} the Qtum network RPC url.
 */
function getQtumRPCAddress() {
  if (_.isUndefined(qtumRPCAddress)) {
    return Config.QTUM_RPC_ADDRESS;
  }
  return qtumRPCAddress;
}

module.exports = {
  Config,
  getQtumRPCAddress,
  getDefaultQtumAddress,
};
