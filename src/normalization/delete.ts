import { FetchAction } from '../models/action';
import { BaseModel, BaseState, DB } from '../models/state';
import { BaseHandler } from './base';
import { BaseItemPayload } from './item';

export class DeleteHandler<TModel extends BaseModel, TPayload extends BaseItemPayload> extends BaseHandler<
  TModel,
  TPayload
> {
  updateDB(db: DB<TModel>, id: any) {
    if (db[id]) {
      // let parent = db[id].parent;
      delete db[id];
      // if (parent && parent.children) {
      // parent.children = parent.children.filter((i) => i.id != id);
      // }
    }
    return db;
  }

  success(state: BaseState<TModel>, action: FetchAction<any>): BaseState<TModel> {
    if (!state.list) return state;

    const index = state.list.findIndex((v) => {
      return v == action.payload.id;
    });

    if (index >= 0) state.list.splice(index, 1);

    return {
      ...super.success(state, action),
      db: this.updateDB(state.db, action.payload.id),
      count: state.count! > 0 ? state.count! - 1 : 0,
      list: state.list.slice(0),
    };
  }
}
