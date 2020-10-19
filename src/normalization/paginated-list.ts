import { ListHandler } from './list';
import { FetchActionHandlerOptions } from '../models/options';
import { FetchAction } from '../models/action';
import { BaseModel, BaseState } from '../models/state';

interface PaginatedListFetchPayload {
  page: number;
  page_size: number;
}

export class PaginatedListHandler<
  TModel extends BaseModel,
  TPayload extends PaginatedListFetchPayload = PaginatedListFetchPayload
> extends ListHandler<TModel, TPayload> {
  constructor(options: FetchActionHandlerOptions<TModel>) {
    super({
      flat: false,
      ...options,
    });
  }

  protected listFromResponse(state: BaseState<TModel>, action: FetchAction<TPayload>): TModel[] {
    const { page, page_size } = action.payload!;
    const { count } = action.response;
    const offset = (page - 1) * page_size;
    const list = this.options.flat ? action.response : action.response[this.options.key];

    // let stateList = state[this.options.stateKey] && list.length > 0 ? state[this.options.stateKey].slice(0, count) : [];
    const stateList = state.list && list.length > 0 ? state.list.slice(0, count) : [];

    for (let i = 0; i < list.length; i++) {
      stateList[i + offset] = list[i];
    }

    return this.modify(stateList).map((i: any) => ({ ...i, ...this.options.default }));
  }

  success(state: BaseState<TModel>, action: FetchAction<TPayload>): BaseState<TModel> {
    const list = this.listFromResponse(state, action);
    const { page, page_size } = action.payload!;
    const { count } = action.response;
    return {
      ...super.success(state, action),
      db: this.updateDB(state.db, list),
      count,
      page: +page,
      page_size: +page_size,
      pages_count: Math.ceil(count / page_size),
      list,
      ...this.options.mixin,
    };
  }
}
