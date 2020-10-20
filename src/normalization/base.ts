import { FetchAction } from '../models/action';
import { FetchActionHandlerOptions } from '../models/options';
import { FetchActionHandler } from '../models/handler';
import { BaseModel, BaseState, DB, ID } from '../models/state';

export class BaseHandler<TModel extends BaseModel, TPayload = any> implements FetchActionHandler<TModel, TPayload> {
  options: FetchActionHandlerOptions<TModel>;

  constructor(options: FetchActionHandlerOptions<TModel>) {
    this.options = {
      loading: false,
      mixin: {},
      ...options,
    };
  }

  protected updateDB(db: DB<TModel>, entry: any): DB<TModel> {
    return db;
  }

  check(action: FetchAction<TPayload>) {
    const { type } = this.options;
    return (
      (typeof type === 'string' && action.type === type) || (Array.isArray(type) && type.indexOf(action.type) > -1)
    );
  }

  handle(state: BaseState<TModel>, action: FetchAction<TPayload>) {
    if (this.check(action)) {
      switch (action.status) {
        case 'success':
          return this.success(state, action);
        case 'error':
          return this.failure(state, action);
        default:
          return this.do(state, action);
      }
    }
    return { ...state, ...this.options.state };
  }

  modify(item: any): any | any[] {
    const { modifier } = this.options;
    if (!modifier) return item;
    return Array.isArray(item) ? item.map(modifier) : modifier(item);
  }

  getMixin(state: BaseState<TModel>, action: FetchAction<TPayload>): any {
    const { mixin } = this.options;
    return typeof mixin === 'function' ? mixin(state, action) : mixin;
  }

  success(state: BaseState<TModel>, action: FetchAction<TPayload>): BaseState<TModel> {
    return {
      ...state,
      prevPayload: action.payload,
      loading: false,
      ...this.getMixin(state, action),
    };
  }

  failure(state: BaseState<TModel>, action: FetchAction<TPayload>): BaseState<TModel> {
    return {
      ...state,
      prevPayload: action.payload,
      loading: false,
      error: this.options.error,
      ...this.getMixin(state, action),
    };
  }

  do(state: BaseState<TModel>, action: FetchAction<TPayload>): BaseState<TModel> {
    return {
      ...state,
      prevPayload: action.payload,
      loading: this.options.loading,
      error: null,
      ...this.getMixin(state, action),
    };
  }
}
