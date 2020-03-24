import {
  ItemRequestActionReducer,
  PaginatedListRequestActionReducer,
  ListRequestActionReducer,
  CreateRequestActionReducer,
  DeleteRequestActionReducer
} from "./common";

import reduxStore from './decorators/reduxStore';
import { get, post, del, patch } from './decorators/reduxAction';

export class CrudEntity {
  constructor(name, uri, options = {}) {
    this.name = name;
    this.uri = uri || '',
    this.options = {
      ...options,
      state: {
        db: {},
        loadingDB: {},
        list: null,
        loading: false,
        error: null,
        ...options.state
      }
    };
  }

  @post(CreateRequestActionReducer)
  create(model) {
    return {
      data: { ...model },
      payload: { model }
    }
  }

  @get(ItemRequestActionReducer)
  get(id) {
    return {
      uri: id,
      payload: { id }
    }
  }
  
  
  @get(({paginated}) => paginated ? PaginatedListRequestActionReducer : ListRequestActionReducer)
  load(params) {
    return {
      payload: { page_size: 10, page: 1, ...params },
      data: { page_size: 10, page: 1, ...params }
    }
  }

  @patch(CreateRequestActionReducer)
  update({id, ...model}, params, validate) {
    return {
      method: validate ? 'put' : 'patch',
      uri: id,
      data: { ...model },
      payload: { id, model, ...params }
    }
  }

  @del(DeleteRequestActionReducer)
  remove(id, params) {
    return {
      method: 'delete',
      uri: id,
      data: { id },
      payload: { id, ...params }
    }
  }
}

export default reduxStore(CrudEntity);
