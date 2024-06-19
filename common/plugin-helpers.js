/**
 * Read key value deep inside object
 * @param {string} key
 * @param {object} object
 * @returns {*} example: read 'object[0].key' from 'object: [{key: value}]
 */
export const deepReadKeyValue = (key, object) => {
  return key
    .split(/[[.\]]/)
    .filter((kp) => !!kp)
    .reduce((nestedOptions, keyPart) => {
      return nestedOptions?.[keyPart];
    }, object);
};

/**
 * Generate string based on tempalte and object with values
 *
 * @param {string} value - template string with keys in {{}}
 * @param {*} object - object with values
 * @returns {string}
 */
export const getKeyPattern = (value, object) => {
  return value.replace(/{(?<key>[^{}]+)}/g, (...params) => {
    const { key } = params[4];
    return deepReadKeyValue(key, object) || '';
  });
};
