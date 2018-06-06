const _ = require('lodash');
require('dotenv').config();

const Config = {
  QTUM_RPC_ADDRESS: 'http://bodhi:bodhi@localhost:13889',
  SENDER_ADDRESS: 'qMZK8FNPRm54jvTLAGEs1biTCgyCkcsmna',
  NEW_ADDRESS_TESTS: false,
  WALLET_TESTS: false,
};

/* Returns the default Qtum address
 * @return {String} default Qtum address.
 */
function getDefaultQtumAddress() {
  return process.env.SENDER_ADDRESS ? String(new Buffer(process.env.SENDER_ADDRESS)) : Config.SENDER_ADDRESS;
}

/* Returns the Qtum network RPC url
 * @return {String} the Qtum network RPC url.
 */
function getQtumRPCAddress() {
  return process.env.QTUM_RPC_ADDRESS ? String(new Buffer(process.env.QTUM_RPC_ADDRESS)) : Config.QTUM_RPC_ADDRESS;
}

module.exports = {
  Config,
  getQtumRPCAddress,
  getDefaultQtumAddress,
};
