const Qweb3 = require('../../src/qweb3');

module.exports = {
  isWalletEncrypted: async (qweb3) => {
    let res = await qweb3.getWalletInfo();
    return res.hasOwnProperty('unlocked_until');
  },
};
