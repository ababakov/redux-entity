import { ItemRequestActionReducer } from './normalization/item-request';
import { PaginatedListRequestActionReducer } from './normalization/paginated-list-request';
import { ListRequestActionReducer } from './normalization/list-request';
import { CreateRequestActionReducer } from './normalization/create';
import { DeleteRequestActionReducer } from './normalization/delete';

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

  @post(CreateRequestActionReducer)
  create(model: TModel) {
    return {
      data: { ...model },
      payload: { model },
    };
  }

  @get(ItemRequestActionReducer)
  get(id: ID) {
    return {
      uri: id,
      payload: { id },
    };
  }

  @get(({ paginated }: any) => (paginated ? PaginatedListRequestActionReducer : ListRequestActionReducer))
  load(params: any) {
    return {
      payload: { page_size: 10, page: 1, ...params },
      data: { page_size: 10, page: 1, ...params },
    };
  }

  @patch(CreateRequestActionReducer)
  update({ id, ...model }: any, params: any, validate: boolean = false) {
    return {
      method: validate ? 'put' : 'patch',
      uri: id,
      data: { ...model },
      payload: { id, model, ...params },
    };
  }

  @del(DeleteRequestActionReducer)
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
