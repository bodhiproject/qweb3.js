module.exports = {
  // Types
  ADDRESS: 'address',
  BOOL: 'bool',
  BYTES: 'bytes',
  STRING: 'string',

  // Regex
  REGEX_STATIC_ARRAY: /\w+\[\d+\]/,
  REGEX_STATIC_ADDRESS_ARRAY: /address\[\d+\]/,
  REGEX_STATIC_BOOL_ARRAY: /bool\[\d+\]/,
  REGEX_UINT: /^uint\d+/,
  REGEX_INT: /^int\d+/,
  REGEX_BYTES: /bytes([1-9]|[12]\d|3[0-2])$/,
  REGEX_STATIC_BYTES_ARRAY: /bytes([1-9]|[12]\d|3[0-2])(\[[0-9]+\])$/,
  REGEX_NUMBER: /[0-9]+/g,
  REGEX_DYNAMIC_ARRAY: /\w+\[\]/,

  // Misc
  MAX_HEX_CHARS_PER_BYTE: 64,
};
