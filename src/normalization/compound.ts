export default class CompoundHandler {
  constructor(options) {
    const { initialState, defaultOptions, reducers } = options;

    this.reducers = reducers ? reducers.map(
      i => {
        if (i.options) {
          i.options = { initialState, ...defaultOptions, ...i.options };
        } 
        return i;
      }) : []
    this.initialState = initialState
  }

  handle(state, action) {
    let result = state || this.initialState;
    for(let i = 0; i < this.reducers.length; i++) {
      const r = this.reducers[i];
      if(typeof r === 'function') {
        result = r(result, action) || result;
      }
      if(r && r.handle) {
        result = r.handle(result, action) || result;
      }
    }
    return result;
  }
}