# Qweb3.js - Web3.js for Qtum

Qweb3 is a library for dApps to interract with Qtum network. Behind the scenes, Qweb3 communicates to a local Qtum node through Qtum-cli RPC calls.

## Get Started
1. Clone repo

	- SSH: `git clone git@github.com:bodhiproject/qweb3.js.git`
	- HTTPS: `git clone https://github.com/bodhiproject/qweb3.js.git`

2. `cd qweb3.js`
3. `npm install`
4. Run tests with `npm test`

## Qweb3.js
Instantiate a new instance of `qweb3.js` if you want to execute the following on qtum-cli:

* **isConnected()**
	
	Checks if you are connected properly to the local qtum node.

* **getHexAddress(address)**
	
	Converts a Qtum address to hex format.

* **fromHexAddress(hexAddress)**

	Converts a hex address to Qtum format.

* **getBlockCount()**
	
	Gets the current block height of your local Qtum node.

* **getTransaction(txid)**

	Gets the transaction details of the transaction id.

* **getTransactionReceipt(txid)**

	Gets the transaction receipt of the transaction id.

* **listUnspent()**

	Gets the unspent outputs that can be used.

* **searchLogs(fromBlock, toBlock, addresses, topics, contractMetadata, removeHexPrefix)**
	
	Gets the logs given the params on the blockchain.

## Contract.js
Instantiate a new instance of `contract.js` if you want to execute the following on qtum-cli:

* **call(methodName, params)**
	
	Executes a `callcontract`.

* **send(methodName, params)**

	Executes a `sendtocontract`.
