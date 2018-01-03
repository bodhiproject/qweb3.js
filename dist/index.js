'use strict';

var Qweb3 = require('./qweb3');

// dont override global variable
if (typeof window !== 'undefined' && typeof window.Qweb3 === 'undefined') {
    window.Qweb3 = Qweb3;
}

module.exports = Qweb3;