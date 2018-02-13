module.exports = {
  ADDRESS: 'address',
  BOOL: 'bool',
  BYTES: 'bytes',
  STRING: 'string',
  REGEX_UINT: /^uint\d+/,
  REGEX_INT: /^int\d+/,
  REGEX_BYTES: /bytes([1-9]|[12]\d|3[0-2])$/,
  REGEX_BYTES_ARRAY: /bytes([1-9]|[12]\d|3[0-2])(\[[0-9]+\])$/,
  REGEX_NUMBER: /[0-9]+/g,
  REGEX_DYNAMIC_ARRAY: /\[\]/,
  MAX_HEX_CHARS_PER_BYTE: 64,
};
