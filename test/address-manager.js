/* global describe,it,beforeEach */
import Qweb3 from '../src/qweb3';

const assert = require('chai').assert;

const AM_ADDRESS = '4544a24b4d71c5f9f90e2c37430ee8c532d0c679';
const AM_ABI = [{
  constant: true, inputs: [], name: 'currentEventFactoryIndex', outputs: [{ name: '', type: 'uint16' }], payable: false, stateMutability: 'view', type: 'function',
}, {
  constant: true, inputs: [{ name: '', type: 'uint16' }], name: 'oracleFactoryAddresses', outputs: [{ name: '', type: 'address' }], payable: false, stateMutability: 'view', type: 'function',
}, {
  constant: true, inputs: [], name: 'getLastEventFactoryIndex', outputs: [{ name: '', type: 'uint16' }], payable: false, stateMutability: 'view', type: 'function',
}, {
  constant: true, inputs: [{ name: '_indexOfAddress', type: 'uint16' }], name: 'getOracleFactoryAddress', outputs: [{ name: '', type: 'address' }], payable: false, stateMutability: 'view', type: 'function',
}, {
  constant: true, inputs: [], name: 'bodhiTokenAddress', outputs: [{ name: '', type: 'address' }], payable: false, stateMutability: 'view', type: 'function',
}, {
  constant: true, inputs: [], name: 'getLastOracleFactoryIndex', outputs: [{ name: '', type: 'uint16' }], payable: false, stateMutability: 'view', type: 'function',
}, {
  constant: true, inputs: [], name: 'currentOracleFactoryIndex', outputs: [{ name: '', type: 'uint16' }], payable: false, stateMutability: 'view', type: 'function',
}, {
  constant: true, inputs: [], name: 'owner', outputs: [{ name: '', type: 'address' }], payable: false, stateMutability: 'view', type: 'function',
}, {
  constant: true, inputs: [], name: 'getBodhiTokenAddress', outputs: [{ name: '', type: 'address' }], payable: false, stateMutability: 'view', type: 'function',
}, {
  constant: false, inputs: [{ name: '_sender', type: 'address' }, { name: '_contractAddress', type: 'address' }], name: 'setOracleFactoryAddress', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function',
}, {
  constant: true, inputs: [{ name: '', type: 'uint16' }], name: 'eventFactoryAddresses', outputs: [{ name: '', type: 'address' }], payable: false, stateMutability: 'view', type: 'function',
}, {
  constant: true, inputs: [{ name: '_indexOfAddress', type: 'uint16' }], name: 'getEventFactoryAddress', outputs: [{ name: '', type: 'address' }], payable: false, stateMutability: 'view', type: 'function',
}, {
  constant: false, inputs: [{ name: '_tokenAddress', type: 'address' }], name: 'setBodhiTokenAddress', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function',
}, {
  constant: false, inputs: [{ name: '_sender', type: 'address' }, { name: '_contractAddress', type: 'address' }], name: 'setEventFactoryAddress', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function',
}, {
  constant: false, inputs: [{ name: '_newOwner', type: 'address' }], name: 'transferOwnership', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function',
}, {
  inputs: [], payable: false, stateMutability: 'nonpayable', type: 'constructor',
}, {
  anonymous: false, inputs: [{ indexed: true, name: '_oldAddress', type: 'address' }, { indexed: true, name: '_newAddress', type: 'address' }], name: 'BodhiTokenAddressChanged', type: 'event',
}, {
  anonymous: false, inputs: [{ indexed: false, name: '_index', type: 'uint16' }, { indexed: true, name: '_contractAddress', type: 'address' }], name: 'EventFactoryAddressAdded', type: 'event',
}, {
  anonymous: false, inputs: [{ indexed: false, name: '_index', type: 'uint16' }, { indexed: true, name: '_contractAddress', type: 'address' }], name: 'OracleFactoryAddressAdded', type: 'event',
}, {
  anonymous: false, inputs: [{ indexed: true, name: '_previousOwner', type: 'address' }, { indexed: true, name: '_newOwner', type: 'address' }], name: 'OwnershipTransferred', type: 'event',
}];

describe('Contract AddressManager', () => {
  describe('methods', () => {
    /** Make sure bodhiTokenAddress returns result */
    it('bodhiTokenAddress', () => {
      const qweb3 = new Qweb3('http://kezjo:qweASD@localhost:13889');

      const contract = new qweb3.Contract(AM_ADDRESS, AM_ABI);

      return contract.call('bodhiTokenAddress')
        .then((res) => {
          console.log(res);
          assert.isDefined(res.executionResult.output);
        });
    });

    /** Make sure getBodhiTokenAddress returns result */
    it('getBodhiTokenAddress', () => {
      const qweb3 = new Qweb3('http://kezjo:qweASD@localhost:13889');

      const contract = new qweb3.Contract(AM_ADDRESS, AM_ABI);

      return contract.call('getBodhiTokenAddress')
        .then((res) => {
          console.log(res);
          assert.isDefined(res.executionResult.output);
        });
    });
  });

  /** Make sure setBodhiTokenAddress returns txid */
  it('setBodhiTokenAddress', () => {
    const qweb3 = new Qweb3('http://kezjo:qweASD@localhost:13889');

    const contract = new qweb3.Contract(AM_ADDRESS, AM_ABI);

    return contract.send('setBodhiTokenAddress', {
      senderAddress: 'qXtCoQkTEpYRWb5puzC6Wfrquc8K9f2sZs',
      data: ['0x5089a838dc9b27174c3b7a0314c6a6219d3002ed'],
    })
      .then((res) => {
        console.log(res);
        assert.isDefined(res.txid);
      });
  });

  /** Make sure getLastOracleFactoryIndex returns result */
  it('getLastOracleFactoryIndex', () => {
    const qweb3 = new Qweb3('http://kezjo:qweASD@localhost:13889');

    const contract = new qweb3.Contract(AM_ADDRESS, AM_ABI);

    return contract.call('getLastOracleFactoryIndex')
      .then((res) => {
        console.log(res);
        assert.isDefined(res.executionResult.output);
      });
  });

  /** Make sure eventFactoryAddresses returns result */
  it('eventFactoryAddresses', () => {
    const qweb3 = new Qweb3('http://kezjo:qweASD@localhost:13889');

    const contract = new qweb3.Contract(AM_ADDRESS, AM_ABI);

    return contract.call('eventFactoryAddresses', 0)
      .then((res) => {
        console.log(res);
        assert.isDefined(res.executionResult.output);
        assert.equal(res.executionResult.output, '000000000000000000000000f6464ab9222b959a50765ac5c4889f8c3fe24241');
      });
  });
});
