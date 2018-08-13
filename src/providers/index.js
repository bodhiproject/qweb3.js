const { includes } = require('lodash');

const HttpProvider = require('./http-provider');

const compatibleProviders = [
  'HttpProvider',
  'QryptoProvider',
];

const initProvider = (provider) => {
  if (typeof provider === 'string') {
    return new HttpProvider(provider);
  }

  const className = provider.constructor.name;
  if (!includes(compatibleProviders, className)) {
    throw Error(`Incompatible provider: ${className}`);
  }

  return provider;
};

module.exports = {
  initProvider,
};
