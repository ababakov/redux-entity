import ListRequestActionReducer from './list-request';
import RequestActionHandlerOptions from '../models/options';
import RequestAction from '../models/action';
import BaseNormalizedState from '../models/state';

export default class PaginatedListRequestActionReducer<TState extends BaseNormalizedState> extends ListRequestActionReducer {
  constructor(options:RequestActionHandlerOptions) {
    super({
      flat: false,
      ...options,
    });
  }

  listFromResponse(state:any, action:RequestAction) {
    const { page, page_size } = action.payload;
    const { count } = action.response;
    const offset = (page - 1) * page_size;
    const list = this.options.flat ? action.response : action.response[this.options.key];
    let stateList = state[this.options.stateKey] && list.length > 0 ? state[this.options.stateKey].slice(0, count) : [];

    for (let i = 0; i < list.length; i++) {
      stateList[i + offset] = list[i];
    }

    return this.modify(stateList).map((i:any) => ({ ...i, ...this.options.default }));
  }

  success(state:any, action:RequestAction) {
    const list = this.listFromResponse(state, action);
    const { page, page_size } = action.payload;
    const { count } = action.response;
    return {
      ...super.success(state, action),
      db: this.updateDB(state.db, list),
      count,
      page: +page,
      page_size: +page_size,
      pages_count: Math.ceil(count / page_size),
      [this.options.stateKey]: list,
      ...this.options.mixin,
    };
  }
}
