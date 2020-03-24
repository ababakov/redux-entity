export class BaseRequestActionReducer {
  constructor(options) {
    this.options = { 
      loading: false,
      mixin: {},
      ...options
    };
  }

  check(action) {
    const { type } = this.options;
    return typeof type === 'string' && action.type === type ||
       Array.isArray(type) && type.indexOf(action.type) > -1;
  }

  handle(state, action) {
    if(this.check(action)) {
      switch(action.status) {
        case 'success':
          return this.success(state, action)
        case 'error':
          return this.failure(state, action)
        default:
          return this.request(state, action)
      }
    }
    return { ...state, ...this.options.state };
  }

  modify(i) {
    const { modifier } = this.options;
    if(!modifier) return i;
    return Array.isArray(i) ? i.map(modifier) : modifier(i);
  }

  getMixin(state, action) {
    const { mixin } = this.options;
    return typeof mixin === 'function' ? mixin(state, action) : mixin;
  }

  success(state, action) {
    return {
      ...state,
      prevPayload: action.payload,
      loading: false,
      ...this.getMixin(state, action)
    }
  }

  failure(state, action) {
    return {
      ...state,
      prevPayload: action.payload,
      loading: false,
      error: this.options.error,
      ...this.getMixin(state, action)
    }
  }

  request(state, action) {
    return {
      ...state,
      prevPayload: action.payload,
      loading: this.options.loading,
      error: null,
      ...this.getMixin(state, action)
    }
  }
}
