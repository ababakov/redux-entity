import { RequestActionHandlerOptions } from "../models/options";
import { BaseNormalizedState, BaseModel } from "../models/state";
import { RequestAction } from "../models/action";

export class CompoundHandler<TModel extends BaseModel> {
  private reducers: any[];
  private initialState?: BaseNormalizedState<TModel>;

  constructor(options:RequestActionHandlerOptions<TModel>) {
    const { initialState, defaultOptions, reducers } = options;

    this.reducers = reducers
      ? reducers.map((i) => {
          if (i.options) {
            i.options = { initialState, ...defaultOptions, ...i.options };
          }
          return i;
        })
      : [];
    this.initialState = initialState;
  }

  handle(state:BaseNormalizedState<TModel>, action:RequestAction):BaseNormalizedState<TModel> {
    let result = state || this.initialState;
    for (let i = 0; i < this.reducers.length; i++) {
      const r = this.reducers[i];
      if (typeof r === 'function') {
        result = r(result, action) || result;
      }
      if (r && r.handle) {
        result = r.handle(result, action) || result;
      }
    }
    return result;
  }
}
