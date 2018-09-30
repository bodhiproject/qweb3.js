const HttpProvider = require('./http-provider');

const initProvider = (provider) => {
  if (!provider) {
    throw Error('provider cannot be undefined.');
  }

  // URL was passed to create an HttpProvider instance
  if (typeof provider === 'string') {
    return new HttpProvider(provider);
  }

  // Check for rawCall() in provider object
  if (!provider.rawCall || typeof provider.rawCall !== 'function') {
    throw Error('provider is not a compatible Qweb3 Provider.');
  }

  return provider;
};

module.exports = { initProvider };
