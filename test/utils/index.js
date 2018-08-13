require('dotenv').config();

module.exports = {
  /**
   * Returns the default Qtum address.
   * @return {String} Default Qtum address.
   */
  getDefaultQtumAddress: () => {
    if (!process.env.SENDER_ADDRESS) {
      throw Error('Must have SENDER_ADDRESS in .env');
    }
    return String(Buffer.from(process.env.SENDER_ADDRESS));
  },

  /**
   * Returns the Qtum network RPC url.
   * @return {String} The Qtum network RPC url.
   */
  getQtumRPCAddress: () => {
    if (!process.env.QTUM_RPC_ADDRESS) {
      throw Error('Must have QTUM_RPC_ADDRESS in .env');
    }
    return String(Buffer.from(process.env.QTUM_RPC_ADDRESS));
  },

  /**
   * Returns the wallet passphrase to unlock the encrypted wallet.
   * @return {String} The wallet passphrase.
   */
  getWalletPassphrase: () => (process.env.WALLET_PASSPHRASE ? String(Buffer.from(process.env.WALLET_PASSPHRASE)) : ''),

  isWalletEncrypted: async (qweb3) => {
    const res = await qweb3.getWalletInfo();
    return Object.prototype.hasOwnProperty.call(res, 'unlocked_until');
  },
};
