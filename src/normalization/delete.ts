import BaseRequestActionReducer from './base';

export class DeleteRequestActionReducer extends BaseRequestActionReducer {
  updateDB(db, id) {
    if (db[id]) {
      let parent = db[id].parent;
      delete db[id];
      if (parent && parent.children) {
        parent.children = parent.children.filter((i) => i.id != id);
      }
    }
    return db;
  }

  success(state, action) {
    if (!state.list) return state;

    var index = state.list.findIndex((v) => {
      return v.id == action.payload.id;
    });

    if (index >= 0) state.list.splice(index, 1);

    return {
      ...super.success(state, action),
      db: this.updateDB(state.db, action.payload.id),
      count: state.count > 0 ? state.count - 1 : 0,
      list: state.list.slice(0),
    };
  }
}
