import BaseNormalizedState from "./state";

export default interface RequestActionHandlerOptions {
  initialState?:BaseNormalizedState;
  defaultOptions?:RequestActionHandlerOptions;
  loading?: boolean;
  mixin?: any;
  type?: string;
  key: string;
  stateKey: string;
  default?: any;
  state?: BaseNormalizedState;
  modifier?: (_:any) => any;
  reducers?: any[];
  // to list options?
  flat?: boolean;
  flush?: boolean;
}
