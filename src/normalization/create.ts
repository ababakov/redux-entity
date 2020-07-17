import BaseRequestActionReducer from './base';

export default class CreateRequestActionReducer extends BaseRequestActionReducer {
  updateDB(db, entry) {
    db = db || {};
    db[entry.id] = { ...entry, ...this.default };
    entry.parentId && (entry.parent = db[entry.parentId]);
    return db;
  }

  success(state, action) {
    const entry = this.modify(action.response);
    const flush = this.options.flush;
    const isNewItem = state.list && state.list.findIndex((i) => i && i.id == entry.id) == -1;
    return {
      ...super.success(state, action),
      db: this.updateDB(state.db, entry),
      count: state.count + (isNewItem ? 1 : 0),
      list: state.list
        ? !isNewItem
          ? state.list.map((i) => (i.id == entry.id ? entry : i))
          : // that's isn't right for paginated list -- need to fully reload list
          // (for paginated if create - cause of sort, but for update it's ok to replace)
          // possible safer is to make it null- that will trigger reload
          flush
          ? null
          : [entry, ...state.list]
        : null, // if null then list wasn't loaded
    };
  }
}
