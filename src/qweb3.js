import Qtum from './qtum.js';
import HttpProvider from './httpprovider.js';
import Contract from './contract';

class Qweb3 {

  constructor(url) {

    const self = this;

    // TODO: url string validation
    this.provider = new HttpProvider(url);
    this.qtum = new Qtum(this);

    this.Contract = (address, abi) => new Contract(self, address, abi);
  }

  isConnected() {
    return this.provider.request({
        method: 'getinfo'
      })
      .then((res) => {
        return Promise.resolve(!!res);
      }, (err) => {
        return Promise.resolve(false);
      });
  }

  getTransaction(txid){
    return this.provider.request({
      method: 'gettransaction',
      params: [txid]
    });
  }
}

export default Qweb3;