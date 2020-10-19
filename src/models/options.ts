import { BaseNormalizedState, BaseModel } from "./state";

export interface RequestActionHandlerOptions<TModel extends BaseModel> {
  initialState?: BaseNormalizedState<TModel>;
  defaultOptions?: RequestActionHandlerOptions<TModel>;
  loading?: boolean;
  mixin?: any;
  type?: string;
  key: string;
  stateKey: string;
  default?: any;
  state?: BaseNormalizedState<TModel>;
  modifier?: (_:any) => any;
  reducers?: any[];
  // to list options?
  flat?: boolean;
  flush?: boolean;
}
