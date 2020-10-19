import { BaseModel, BaseState, DB, ID } from '../models/state';
import { BaseHandler } from './base';
import { FetchActionHandlerOptions } from '../models/options';
import { FetchAction } from '../models/action';


export interface BaseItemPayload {
  id: ID
}


export class ItemHandler<TModel extends BaseModel, TPayload extends BaseItemPayload> extends BaseHandler<TModel, TPayload> {
  constructor(options: FetchActionHandlerOptions<TModel>) {
    super({
      // key: '',
      ...options,
    });
  }

  protected updateDB(db:DB<TModel>, entry:TModel): DB<TModel> {
    if (!db) db = {};
    if (!entry) return db;
    db[entry.id] = { ...entry, ...this.options.default };
    return db;
  }

  do(state: BaseState<TModel>, action: FetchAction<TPayload>): BaseState<TModel> {
    return {
      ...state,
      loadingDB: { ...state.loadingDB, [action.payload.id]: true },
      error: null,
    };
  }

  success(state: BaseState<TModel>, action: FetchAction<TPayload>): BaseState<TModel> {
    const { stateKey, key } = this.options;
    const { list } = state;
    const entry = this.modify(key ? action.response[key] : action.response);
    return {
      ...super.success(state, action),
      db: this.updateDB(state.db, entry),
      loadingDB: { ...state.loadingDB, [entry.id]: false },
      list: list ? list.map((i) => (i == entry.id ? entry : i)) : undefined,
    };
  }

  failure(state: BaseState<TModel>, action: FetchAction<TPayload>): BaseState<TModel> {
    return {
      ...super.failure(state, action),
      [this.options.stateKey]: null,
    };
  }
}
