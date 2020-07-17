import BaseRequestActionReducer from './base';

export default class ItemRequestActionReducer extends BaseRequestActionReducer {
  constructor(options) {
    super({
      key: '',
      stateKey: 'list',
      ...options,
    });
  }

  updateDB(db, entry, parent) {
    if (!db) db = {};
    if (!entry) return db;
    db[entry.id] = { ...entry, ...this.options.default };
    return db;
  }

  request(state, action) {
    return {
      ...state,
      loadingDB: { ...state.loadingDB, [action.payload.id]: true },
      error: null,
    };
  }

  success(state, action) {
    const { stateKey, key } = this.options;
    const list = state[stateKey];
    const entry = this.modify(key ? action.response[key] : action.response);
    return {
      ...super.success(state, action),
      db: this.updateDB(state.db, entry),
      loadingDB: { ...state.loadingDB, [entry.id]: false },
      [stateKey]: list ? list.map((i) => (i.id == entry.id ? entry : i)) : null,
    };
  }

  failure(state, action) {
    return {
      ...super.failure(state, action),
      [this.options.stateKey]: null,
    };
  }
}
