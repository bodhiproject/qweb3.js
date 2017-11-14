# Qweb3.js - Web3.js for Qtum

Qweb3 is a library for Dapps to interract with Qtum network. Behind the scene Qweb3 communicates to a local Qtum node through RPC calls.

# Get Started
1. `git clone https://github.com/bodhiproject/qweb3.js.git`
2. `cd qweb3`
3. `npm install`
4. Run tests with `npm run test`

# Qweb3.js API Reference

### QTUM
  * qweb3.qtum.getTransaction

### Accounts (Not Implemented yet)

  * Create
	qweb3.bot.accounts.create()

  * GetBalance
	qweb3.bot.getBalance(address)

### Contract
  * qweb3.Contract.call();
  * qweb3.Contract.send();
  * qweb3.Contract.searchLogs();
  * Subscribe

### Utility
  * qweb3.bot.fromBotoshi();

# Developing
### Tips
  * Eslint is used to examine Javascript syntax. Use `npm run lint:fix` to auto-fix spacing, and check code.

# Testing
Testing is done with mocha + babel-register plugin. An excample to run all tests in ./test/qweb3.js would be
`mocha --compilers js:babel-register "./test/qweb3.js"`

In addition, you can add "-g" option to run a specific test, and use "--inspect-brk" to debug in Chrome Dev Tool.
`mocha --compilers js:babel-register "./test/qweb3.js" -g "getTransaction" --inspect-brk`
