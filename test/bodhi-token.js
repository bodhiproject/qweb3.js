/* global describe,it,beforeEach */
const assert = require('chai').assert;

import _ from 'lodash';
import Qweb3 from '../src/qweb3';
import Contracts from './data/Contracts';
import utils from '../src/utils';

describe('Contract BodhiToken', () => {

  let qweb3;
  let contract;

  beforeEach(() => {

    qweb3 = new Qweb3('http://kezjo:qweASD@localhost:13889');
    contract = new qweb3.Contract(Contracts.BodhiToken.address, Contracts.BodhiToken.abi);

    // TODO: Enter wallet passphrase
  });

  describe('methods', () => {
    /** Search past Mint logs */
    it('searchLogs Mint', () => {

      const fromBlock = 0;
      const toBlock = -1;
      const addresses = Contracts.BodhiToken.address;

      // TODO: generate topic only by specifying 'Mint'
      const topics = ['4e3883c75cc9c752bb1db2e406a822e4a75067ae77ad9a0a4d179f2709b9e1f6'];

      return contract.searchLogs(fromBlock, toBlock, addresses, topics)
        .then((res) => {
          console.log(`Retrieved ${res.length} entries from searchLogs.`);

          res.forEach((entry, index) => {
            // Bodhi contract specific - convert byte and byte32 to string
            if (!_.isEmpty(entry.log)) {
              _.each(entry.log, (logEntry) => {
                _.each(logEntry, (value, key) => {
                  // Convert value of field '_name' (byte32[]) and '_resultNames' (byte32[])
                  if (key === 'supply' || key === 'amount') {
                    logEntry[key] = value.toNumber();
                  }
                });
              })
            }

            console.log(entry);

          });
        });
    });

    /** Search past Transfer logs */
    it('searchLogs Transfer', () => {

      const fromBlock = 30000;
      const toBlock = -1;
      const addresses = Contracts.BodhiToken.address;

      // TODO: generate topic only by specifying 'Mint'
      const topics = ['ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'];

      return contract.searchLogs(fromBlock, toBlock, addresses, topics)
        .then((res) => {
          console.log(`Retrieved ${res.length} entries from searchLogs.`);

          res.forEach((entry, index) => {
            // Bodhi contract specific - convert byte and byte32 to string
            if (!_.isEmpty(entry.log)) {
              _.each(entry.log, (logEntry) => {
                _.each(logEntry, (value, key) => {
                  // Convert value of field '_name' (byte32[]) and '_resultNames' (byte32[])
                  if (key === '_value') {
                    logEntry[key] = value.toNumber();
                  }
                });
              })
            }

            console.log(entry);
          });
        });
    });
  });
});