import Qweb3 from './qweb3';
import Contract from './contract';
import Decoder from './decoder';
import Utils from './utils';

// dont override global variable
if (typeof window !== 'undefined' && typeof window.Qweb3 === 'undefined') {
  window.Qweb3 = Qweb3;
}

export {
  Qweb3,
  Contract,
  Decoder,
  Utils
};
