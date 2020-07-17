export function buildFormData(formData:FormData, data:any, parentKey:string = "") {
  if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
    Object.keys(data).forEach((key) => {
      buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
    });
  } else {
    const value = data == null ? '' : data;

    formData.append(parentKey, value);
  }
}

export function jsonToFormData(data:any) {
  if (data.constructor && data.constructor.name === 'FormData') {
    return data;
  }

  const formData = new FormData();

  buildFormData(formData, data);

  return formData;
}

const toString = Function.prototype.toString

function fnBody(fn:any) {
  return toString.call(fn).replace(/^[^{]*{\s*/, '').replace(/\s*}[^}]*$/, '')
}

export function isClass(fn:any) {
  if (typeof fn !== 'function') {
    return false
  }

  console.log(toString.call(fn))


  if (/^class[\s{]/.test(toString.call(fn))) {
    return true
  }

  // babel.js classCallCheck() & inlined
  const body = fnBody(fn)
  return (/classCallCheck\(/.test(body) || /TypeError\("Cannot call a class as a function"\)/.test(body))
}