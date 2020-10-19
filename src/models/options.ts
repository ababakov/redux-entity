import { BaseState, BaseModel } from "./state";

export interface FetchActionHandlerOptions<TModel extends BaseModel> {
  initialState?: BaseState<TModel>;
  defaultOptions?: FetchActionHandlerOptions<TModel>;
  loading?: boolean;
  mixin?: any;
  type?: string;
  key: string;
  error?: string;
  stateKey: string;
  default?: any;
  state?: BaseState<TModel>;
  modifier?: (_:any) => any;
  reducers?: any[];
  // to list options?
  flat?: boolean;
  flush?: boolean;
}
