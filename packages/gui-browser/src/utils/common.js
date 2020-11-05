export function getLanguage() {
  const lang = navigator.language || navigator.userLanguage;
  return localStorage.getItem('lang') || lang ;
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