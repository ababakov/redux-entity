import { FetchActionHandlerOptions } from "../models/options";
import { BaseState, BaseModel } from "../models/state";
import { FetchAction } from "../models/action";

export class CompoundHandler<TModel extends BaseModel, TPayload> {
  private reducers: any[];
  private initialState?: BaseState<TModel>;

  constructor(options:FetchActionHandlerOptions<TModel>) {
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

  handle(state:BaseState<TModel>, action:FetchAction<TPayload>):BaseState<TModel> {
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
