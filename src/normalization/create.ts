import { BaseHandler } from './base';
import { FetchAction } from '../models/action';
import { BaseModel, BaseState, DB } from '../models/state';

export class CreateHandler<TModel extends BaseModel, TPayload> extends BaseHandler<TModel, TPayload> {
  protected updateDB(db: DB<TModel>, entry: any): DB<TModel> {
    db = db || {};
    db[entry.id] = { ...entry, ...this.options.default };
    entry.parentId && (entry.parent = db[entry.parentId]);
    return db;
  }

  success(state: BaseState<TModel>, action: FetchAction<TPayload>): BaseState<TModel> {
    const entry = this.modify(action.response);
    const flush = this.options.flush;
    const isNewItem = state.list && state.list.findIndex((i) => i && i == entry.id) == -1;
    return {
      ...super.success(state, action),
      db: this.updateDB(state.db, entry),
      count: (state.count ?? 0) + (isNewItem ? 1 : 0),
      list: state.list
        ? !isNewItem
          ? state.list.map((i) => (i == entry.id ? entry : i))
          : // that's isn't right for paginated list -- need to fully reload list
          // (for paginated if create - cause of sort, but for update it's ok to replace)
          // possible safer is to make it null- that will trigger reload
          flush
          ? undefined
          : [entry.id, ...state.list]
        : undefined, // if null then list wasn't loaded
    };
  }
}
