import { BaseHandler } from './base';
import { BaseModel, BaseState, ID } from '../models/state';
import { FetchAction } from '../models/action';

export class DeleteAllHandler<TModel extends BaseModel, TPayload>  extends BaseHandler<TModel, TPayload> {
  success(state:BaseState<TModel>, action:FetchAction<TPayload>):BaseState<TModel> {
    if (action.response && action.response.result) {
      let { db, list } = state;
      action.response.result.forEach((id: ID) => {
        if (db[id]) {
          delete db[id];
        }
        const index = list!.findIndex((i) => i == id);
        if (index >= 0) {
          list!.splice(index, 1);
        }
      });
      return {
        ...super.success(state, action),
        db,
        list,
      };
    } else
      return {
        ...super.success(state, action),
      };
  }
}
