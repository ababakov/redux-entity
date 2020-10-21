import { ItemHandler } from './normalization/item';
import { PaginatedListHandler } from './normalization/paginated-list';
import { ListHandler } from './normalization/list';
import { CreateHandler } from './normalization/create';
import { DeleteHandler } from './normalization/delete';

import { reduxStore } from './decorators/store';
import { get, post, del, patch, RegisteredClass, HandlersRegistry } from './decorators/action';
import { BaseModel } from './models/state';
import { FetchActionHandlerOptions } from './models/options';

export interface CrudEntityOptions<TModel extends BaseModel = BaseModel> {
  state?: any;
  permit?: any;
  sideEffects?: any;
  defaultOptions?: FetchActionHandlerOptions<TModel>;
}

type ID = string | number;

export class CrudEntity<TModel extends BaseModel = BaseModel> implements RegisteredClass {
  registry?: HandlersRegistry;

  constructor(public name: string, public uri: string = '', public options: CrudEntityOptions<TModel> = {}) {
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

  @post(CreateHandler)
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

  @patch(CreateHandler)
  update({ id, ...model }: any, params: any, validate = false) {
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
    throw new Error('Not implemented');
  }
}

export const CrudEntityStore = reduxStore(CrudEntity);
