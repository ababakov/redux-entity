import { BaseModel, BaseState, DB } from '../models/state';
import { BaseHandler } from './base';
import { FetchActionHandlerOptions } from '../models/options';
import { FetchAction } from '../models/action';

export class ListHandler<TModel extends BaseModel, TPayload> extends BaseHandler<TModel, TPayload> {
  constructor(options: FetchActionHandlerOptions<TModel>) {
    super({
      loading: true,
      // key: 'results',
      // stateKey: 'list',
      flat: true,
      ...options,
    });
  }

  updateDB(db: DB<TModel>, list:any): DB<TModel> {
    db = db || {};
    if (!list) return {};
    list.forEach((i: any) => {
      db[i.id] = { ...i, ...this.options.default };
    });
    return db;
  }

  protected listFromResponse(state: BaseState<TModel>, action: FetchAction<TPayload>): TModel[] {
    return this.modify(this.options.flat ? action.response : action.response[this.options.key]).map((i: any) =>
      this.options.default ? { ...i, ...this.options.default } : i,
    );
  }

  success(state:BaseState<TModel>, action:FetchAction<TPayload>): BaseState<TModel> {
    const list = this.listFromResponse(state, action);
    const { count } = action.response;
    return {
      ...super.success(state, action),
      db: this.updateDB(state.db, list),
      count: count || list.length,
      [this.options.stateKey]: list,
    };
  }

  failure(state:BaseState<TModel>, action:FetchAction<TPayload>): BaseState<TModel> {
    return {
      ...super.failure(state, action),
      [this.options.stateKey]: null,
    };
  }
}
