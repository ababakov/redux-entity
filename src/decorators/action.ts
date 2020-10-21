import { CrudEntity, CrudEntityOptions } from '../crud-entity';
import { MethodType } from '../models/action';
import { BaseModel } from '../models/state';
import { BaseHandler } from '../normalization/base';

export type HandlerType = { new (...args: any): BaseHandler<BaseModel, any> } | { (...args: any): any };

export type HandlersRegistryItem = { key: string; Reducer: HandlerType };
export type HandlersRegistry = HandlersRegistryItem[];
export interface RegisteredClass {
  __proto__?: RegisteredClass;
  registry?: HandlersRegistry;
  name: string;
  configure?: (arg: any) => any;
  options: CrudEntityOptions;
}

function registerReducer<T extends RegisteredClass>(target: T, key: string, Reducer: HandlerType) {
  if (!Object.getOwnPropertyDescriptor(target, 'registry') && target.__proto__!.registry) {
    target.registry = [...target.__proto__!.registry];
  } else {
    target.registry = target.registry || [];
  }

  Object.defineProperty(target, key + '_key', {
    get: function () {
      return this.name + '.' + key;
    },
  });

  target.registry.push({ key, Reducer });
}

const emptyReducer = () => () => null;

export function reduxAction(method: MethodType) {
  return function (Reducer: HandlerType) {
    return function (target: RegisteredClass, key: string, descriptor: PropertyDescriptor) {
      // console.log(target, key, descriptor);

      const originalMethod = descriptor.value;

      registerReducer(target, key, Reducer || emptyReducer);

      descriptor.value = function (this: CrudEntity, ...args: any[]) {
        const { data, payload, format, uri = '' } = originalMethod.call(this, ...args);
        return {
          type: this.name + '.' + key,
          uri: this.uri + (uri ? '/' + uri : ''),
          method,
          format,
          data,
          payload,
        };
      };

      return descriptor;
    };
  };
}

export function action<T extends RegisteredClass>(Reducer: HandlerType) {
  return function (target: T, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    registerReducer(target, key, Reducer);

    descriptor.value = function (this: T, ...args: any[]) {
      const { payload } = originalMethod.call(this, ...args);
      return {
        type: [this.name, key].join('.'),
        payload,
      };
    };
  };
}

export const get = reduxAction('GET');
export const post = reduxAction('POST');
export const del = reduxAction('DELETE');
export const patch = reduxAction('PATCH');
export const put = reduxAction('PUT');
