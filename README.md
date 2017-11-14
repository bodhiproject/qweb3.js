# Qweb3.js - Web3.js for Qtum

Qweb3 is a library for Dapps to interract with Qtum network. Behind the scene Qweb3 communicates to a local Qtum node through RPC calls.

`web3` contains the `eth` object - `web3.eth` (for specifically Ethereum blockchain interactions) and the `shh` object - `web3.shh` (for Whisper interaction). Over time we'll introduce other objects for each of the other web3 protocols. Working  [examples can be found here](https://github.com/ethereum/web3.js/tree/master/example).

If you want to look at some more sophisticated examples using web3.js check out these [useful app patterns](https://github.com/ethereum/wiki/wiki/Useful-Ðapp-Patterns).

# Usage example


# Qweb3.js API Reference

## QTUM
qweb3.qtum.getTransaction

### Accounts

  * Create
	qweb3.bot.accounts.create()

  * GetBalance
	qweb3.bot.getBalance(address)

### Contract
qweb3.qtum.Contract(contractABI, contractAddress);

  * GetPastEvents
	contract.getPastEvents('allEvents', {
        filter: { _to: '0x3184Ae2a7d52bf89C902072CbC87c231c73b96b9'  }, 
        fromBlock: fromBlockNum,
        toBlock: toBlockNum
    }, function(error, events) {
        if (error) {
            console.log('error', error);
        }
        console.log('events', events);
    })
    .then(function(events) {
        console.log(events) // same results as the optional callback above
    });

  * Subscribe

### Utility
qweb3.bot.fromWei();


# Testing
We use mocha + babel-register plugin to transplie and run tests under root ./test

## Debug with Mocha
mocha --compilers js:babel-register "./test/unit/huobi.js" "-g" "getProductsTickerWebsocket" --inspect --debug-brk
