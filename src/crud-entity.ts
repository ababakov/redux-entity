import { ItemHandler } from './normalization/item';
import { PaginatedListHandler } from './normalization/paginated-list';
import { ListHandler } from './normalization/list';
import { CreateFetchActionReducer } from './normalization/create';
import { DeleteHandler } from './normalization/delete';

import { reduxStore } from './decorators/reduxStore';
import { get, post, del, patch } from './decorators/reduxAction';


interface CrudEntityOptions {
  state?: any
}

type ID = String | number


export class CrudEntity<TModel> {

  constructor(
    private name: String, 
    private uri: String = '', 
    private options: CrudEntityOptions = {}
  ) {
    this.options = {
      ...options,
      state: {
        db: {},
        loadingDB: {},
        list: null,
        loading: false,
        error: null,
        ...options.state,
      },
    };
  }

  @post(CreateFetchActionReducer)
  create(model: TModel) {
    return {
      data: { ...model },
      payload: { model },
    };
  }

  @get(ItemHandler)
  get(id: ID) {
    return {
      uri: id,
      payload: { id },
    };
  }

  @get(({ paginated }: any) => (paginated ? PaginatedListHandler : ListHandler))
  load(params: any) {
    return {
      payload: { page_size: 10, page: 1, ...params },
      data: { page_size: 10, page: 1, ...params },
    };
  }

  @patch(CreateFetchActionReducer)
  update({ id, ...model }: any, params: any, validate: boolean = false) {
    return {
      method: validate ? 'put' : 'patch',
      uri: id,
      data: { ...model },
      payload: { id, model, ...params },
    };
  }

  @del(DeleteHandler)
  remove(id: ID, params: any) {
    return {
      method: 'delete',
      uri: id,
      data: { id },
      payload: { id, ...params },
    };
  }
  
  // result reducer generator
  reducer() {
    throw new Error("Not implemented")
  }
}

export default reduxStore(CrudEntity);
