const { initProvider } = require('./providers');
const Utils = require('./utils');
const Encoder = require('./formatters/encoder');
const Decoder = require('./formatters/decoder');

const DEFAULT_AMOUNT = 0;
const DEFAULT_GAS_LIMIT = 250000;
const DEFAULT_GAS_PRICE = 0.0000004;

class Contract {
  /**
   * Contract constructor.
   * @param {string|Qweb3Provider} provider Either URL string to create HttpProvider or a Qweb3 compatible provider.
   * @param {string} address Address of the contract.
   * @param {array} abi ABI of the contract.
   */
  constructor(provider, address, abi) {
    this.provider = initProvider(provider);
    this.address = Utils.trimHexPrefix(address);
    this.abi = abi;
  }

  /**
   * Executes a callcontract on a view/pure method.
   * @param {string} methodName Name of contract method
   * @param {object} params Parameters of contract method
   * @return {Promise} Call result.
   */
  async call(methodName, params) {
    const { methodArgs, senderAddress } = params;
    const data = Encoder.constructData(this.abi, methodName, methodArgs);
    let result = await this.provider.rawCall('callcontract', [this.address, data, senderAddress]);
    result = Decoder.decodeCall(result, this.abi, methodName, true); // Format the result
    return result;
  }

  /**
   * Executes a sendtocontract transaction.
   * @param {string} methodName Method name to call.
   * @param {object} params Parameters of the contract method.
   * @return {Promise} Transaction ID of the sendtocontract.
   */
  async send(methodName, params) {
    try {
      // Throw if methodArgs or senderAddress is not defined in params
      Utils.paramsCheck('send', params, ['methodArgs', 'senderAddress']);

      const { methodArgs, amount, gasLimit, gasPrice, senderAddress } = params;
      const data = Encoder.constructData(this.abi, methodName, methodArgs);
      const amt = amount || DEFAULT_AMOUNT;
      const limit = gasLimit || DEFAULT_GAS_LIMIT;
      const price = gasPrice || DEFAULT_GAS_PRICE;

      const result = await this.provider.rawCall('sendtocontract', [
        this.address,
        data,
        amt,
        limit,
        price.toFixed(8),
        senderAddress,
      ]);

      // Add original request params to result obj
      result.args = {
        contractAddress: this.address,
        amount: amt,
        gasLimit: limit,
        gasPrice: price,
      };
      return result;
    } catch (err) {
      throw Error(err);
    }
  }
}

module.exports = Contract;
