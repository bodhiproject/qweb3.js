module.exports = {
  isWalletEncrypted: async (qweb3) => {
    const res = await qweb3.getWalletInfo();
    return Object.prototype.hasOwnProperty.call(res, 'unlocked_until');
  },
};
