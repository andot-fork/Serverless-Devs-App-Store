const BASIC_DATA_TYPE = ['string', 'number', 'boolean'];

export function generateMagicVariables(value, globalJsonKeyMap = {}, parentStr = '') {
  if (Object.prototype.toString.call(value) === '[object Object]') {
    if (parentStr !== '') {
      parentStr = `${parentStr}.`;
    }
    Object.keys(value).forEach((key) => {
      let showKey = `${parentStr}${key}`;
      let objValue = value[key];

      globalJsonKeyMap = Object.assign({}, globalJsonKeyMap, generateMagicVariables(objValue, globalJsonKeyMap, `${showKey}`));
      try {
        if (!BASIC_DATA_TYPE.includes(typeof objValue)) {
          objValue = JSON.stringify(objValue);
        }
      } catch (e) {
        objValue = objValue.toString();
      }
      globalJsonKeyMap[showKey] = objValue;
    });
  } else if (Object.prototype.toString.call(value) === '[object Array]') {
    value.forEach((_arrValue, i) => {
      let showKey = `${parentStr}[${i}]`;

      globalJsonKeyMap = Object.assign({}, globalJsonKeyMap, generateMagicVariables(_arrValue, globalJsonKeyMap, `${showKey}`));

      try {
        if (typeof _arrValue !== 'string') {
          _arrValue = JSON.stringify(_arrValue);
        }
      } catch (e) {
        _arrValue = _arrValue.toString();
      }
      globalJsonKeyMap[showKey] = _arrValue;
    });
  } else {
    globalJsonKeyMap = {};
  }
  return globalJsonKeyMap;
}