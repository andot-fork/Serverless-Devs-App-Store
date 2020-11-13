export function getLanguage() {
  const lang = navigator.language || navigator.userLanguage || '';

  return localStorage.getItem('lang') || lang.split('-')[0];
}

export function bindScroll(elem) {
  if (!elem) {
    return;
  }
  window.addEventListener('scroll', (event) => {

    let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    let offsetTop = elem.offsetTop;
    elem.setAttribute('data-fixed', scrollTop >= offsetTop ? 'fixed' : '')

  }, true);
}

export function unbindScroll() {
  window.removeEventListener('scroll', () => { });
}

export async function bindKeydown(callback) {
  document.body.addEventListener('keydown', (e) => {
    let theEvent = e || window.event;
    let code = theEvent.keyCode || theEvent.which || theEvent.charCode;
    if (code === 13) {
      callback && callback();
      return false;
    }
    return true;
  }, true);
}

export function unbindKeydown() {
  document.body.removeEventListener('keydown', () => { });
}

export function getAllParams() {
  let result = [];
  if (window.location.hash !== '') {
    result = window.location.hash.split('?'); //优先判别hash
  } else {
    result = window.location.href.split('?');
  }

  if (result.length > 1) {
    const r = result[1];
    let data = {};
    r.split('&').forEach((item) => {
      let item_arr = item.split('=');
      data[item_arr[0]] = decodeURIComponent(item_arr[1]);
    });
    return data;
  }

  return null;

}
export function getParams(name) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
  let result = [];
  if (window.location.hash !== '') {
    result = window.location.hash.split('?'); //优先判别hash
  } else {
    result = window.location.href.split('?');
  }

  if (result.length === 1) {
    result = window.parent.location.hash.split('?');
  }

  if (result.length > 1) {
    const r = result[1].match(reg);
    if (r != null) {
      return decodeURIComponent(r[2]);
    }
  }

  return null;
}

export function setParams(name, value) {
  const _originHref = window.location.href.split('#')[0];
  if (!name) {
    return;
  }
  let obj = {};
  if (typeof name === 'string') {
    obj = {
      [name]: value,
    };
  }

  if (Object.prototype.toString.call(name) === '[object Object]') {
    obj = name;
  }

  let hashArr = [];
  if (window.location.hash) {
    hashArr = window.location.hash.split('?');
  }

  const paramArr = (hashArr[1] && hashArr[1].split('&')) || [];

  let paramObj = {};
  paramArr.forEach(val => {
    const tmpArr = val.split('=');
    paramObj[tmpArr[0]] = decodeURIComponent(tmpArr[1] || '');
  });
  paramObj = Object.assign({}, paramObj, obj);

  const resArr =
    Object.keys(paramObj).map(key => {
      return `${key}=${encodeURIComponent(paramObj[key] || '')}`;
    }) || [];
  hashArr[1] = resArr.join('&');
  const hashStr = hashArr.join('?');
  if (window.history.replaceState) {
    const url = _originHref + hashStr;
    window.history.replaceState(null, '', url);
  } else {
    window.location.hash = hashStr;
  }
}
