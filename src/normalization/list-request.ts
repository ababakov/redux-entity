import BaseRequestActionReducer from './base';

export default class ListRequestActionReducer extends BaseRequestActionReducer {
  constructor(options) {
    super({
      loading: true,
      key: 'results',
      stateKey: 'list',
      flat: true,
      ...options,
    });
  }

  updateDB(db, list) {
    db = db || {};
    if (!list) return;
    list.forEach((i) => {
      db[i.id] = { ...i, ...this.options.default };
    });
    return db;
  }

  listFromResponse(state, action) {
    return this.modify(this.options.flat ? action.response : action.response[this.options.key]).map((i) =>
      this.options.default ? { ...i, ...this.options.default } : i,
    );
  }

  success(state, action) {
    const list = this.listFromResponse(state, action);
    const { count } = action.response;
    return {
      ...super.success(state, action),
      db: this.updateDB(state.db, list),
      count: count || list.length,
      [this.options.stateKey]: list,
    };
  }

  failure(state, action) {
    return {
      ...super.failure(state, action),
      [this.options.stateKey]: null,
    };
  }
}
