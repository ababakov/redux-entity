function registerReducer(target, key, Reducer) {

  if(!Object.getOwnPropertyDescriptor(target, 'registry') && target.__proto__.registry) {
    target.registry = [...target.__proto__.registry];
  } else {
    target.registry = target.registry || [];
  }

  Object.defineProperty(target, key + '_key', {
    get: function() {
      return this.name + '.' + key;
    }
  });

  target.registry.push({ key, Reducer });
}

const emptyReducer = () => () => null;

function reduxAction(method) {

  return function(Reducer) {
    return function (target, key, descriptor) {

      // console.log(target, key, descriptor);

      const originalMethod = descriptor.value;

      registerReducer(target, key, Reducer || emptyReducer);

      descriptor.value = function(...args) {
        const { data, payload, format,  uri = ''} = originalMethod.call(this, ...args);
        return {
          type: this.name + '.' + key,
          uri: this.uri + (uri ? '/' + uri : ''),
          method,
          format,
          data,
          payload
        };
      };

      return descriptor;
    }
  }
}

export function action(Reducer) {
  return function(target, key, descriptor) {
    const originalMethod = descriptor.value;

    registerReducer(target, key, Reducer);
    
    descriptor.value = function(...args) {
      const { payload } = originalMethod.call(this, ...args);
      return {
        type: [this.name, key].join('.'),
        payload
      };
    };
  }
}

export default reduxAction;
export const get = reduxAction('get');
export const post = reduxAction('post');
export const del = reduxAction('delete');
export const patch = reduxAction('patch');
export const put = reduxAction('put');
