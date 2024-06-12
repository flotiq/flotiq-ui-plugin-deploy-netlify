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
