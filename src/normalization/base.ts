import { RequestAction } from '../models/action';
import { RequestActionHandlerOptions } from '../models/options';
import { RequestActionHandler } from '../models/handler';
import { BaseModel, BaseNormalizedState } from '../models/state';

export class BaseHandler<TModel extends BaseModel> implements RequestActionHandler {
  options: RequestActionHandlerOptions<TModel>;

  constructor(options: any) {
    this.options = {
      loading: false,
      mixin: {},
      ...options,
    };
  }

  check(action:RequestAction) {
    const { type } = this.options;
    return (
      (typeof type === 'string' && action.type === type) || (Array.isArray(type) && type.indexOf(action.type) > -1)
    );
  }

  handle(state:BaseNormalizedState<TModel>, action:RequestAction) {
    if (this.check(action)) {
      switch (action.status) {
        case 'success':
          return this.success(state, action);
        case 'error':
          return this.failure(state, action);
        default:
          return this.request(state, action);
      }
    }
    return { ...state, ...this.options.state };
  }

  modify(item:any):any|any[] {
    const { modifier } = this.options;
    if (!modifier) return item;
    return Array.isArray(item) ? item.map(modifier) : modifier(item);
  }

  getMixin(state: BaseNormalizedState<TModel>, action) {
    const { mixin } = this.options;
    return typeof mixin === 'function' ? mixin(state, action) : mixin;
  }

  success(state, action) {
    return {
      ...state,
      prevPayload: action.payload,
      loading: false,
      ...this.getMixin(state, action),
    };
  }

  failure(state, action) {
    return {
      ...state,
      prevPayload: action.payload,
      loading: false,
      error: this.options.error,
      ...this.getMixin(state, action),
    };
  }

  request(state, action) {
    return {
      ...state,
      prevPayload: action.payload,
      loading: this.options.loading,
      error: null,
      ...this.getMixin(state, action),
    };
  }
}
