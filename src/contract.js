const { initProvider } = require('./providers');
const Utils = require('./utils');
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
   * @dev Executes a callcontract on a view/pure method via the qtum-cli.
   * @param {string} methodName Name of contract method
   * @param {array} params Parameters of contract method
   * @return {Promise} Promise containing result object or Error
   */
  async call(methodName, params) {
    const { methodArgs, senderAddress } = params;
    const { method: methodObj, args } = this.validateMethodAndArgs(methodName, methodArgs);

    let result = await this.provider.rawCall('callcontract', [
      this.address,
      this.constructDataHex(methodObj, args),
      senderAddress,
    ]);
    // Format the result
    result = Decoder.decodeCall(result, this.abi, methodName, true);
    return result;
  }

  /*
  * @dev Executes a sendtocontract on this contract via the qtum-cli.
  * @param methodName Method name to execute as a string.
  * @param params Parameters of the contract method.
  * @return The transaction id of the sendtocontract.
  */
  async send(methodName, params) {
    // Throw if methodArgs or senderAddress is not defined in params
    Utils.paramsCheck('send', params, ['methodArgs', 'senderAddress']);

    const { methodArgs, amount, gasLimit, gasPrice, senderAddress } = params;
    const { method: methodObj, args } = this.validateMethodAndArgs(methodName, methodArgs);
    const amt = amount || DEFAULT_AMOUNT;
    const limit = gasLimit || DEFAULT_GAS_LIMIT;
    const price = gasPrice || DEFAULT_GAS_PRICE;

    const result = await this.provider.rawCall('sendtocontract', [
      this.address,
      this.constructDataHex(methodObj, args),
      amt,
      limit,
      price.toFixed(8),
      senderAddress,
    ]);

    // Add request object with params used for request
    result.args = {
      contractAddress: this.address,
      amount: amt,
      gasLimit: limit,
      gasPrice: price,
    };

    return result;
  }
}

module.exports = Contract;
