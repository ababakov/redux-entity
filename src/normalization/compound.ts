import RequestActionHandlerOptions from "../models/options";
import BaseNormalizedState from "../models/state";
import RequestAction from "../models/action";

export default class CompoundHandler {
  private reducers: any[];
  private initialState?: BaseNormalizedState;

  constructor(options:RequestActionHandlerOptions) {
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

  handle(state:BaseNormalizedState, action:RequestAction):BaseNormalizedState {
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
