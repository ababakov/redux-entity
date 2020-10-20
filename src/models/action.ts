import { Action as ReduxAction } from 'redux';

export interface Action<TPayload = any> extends ReduxAction<string> {
  payload?: TPayload;
}

export type UriFunction = (state: any) => string;
export type DataFunction = (state: any) => any;

export type MethodType = 'GET' | 'POST' | 'DELETE' | 'PATCH' | 'PUT';
export type FormatType = 'json' | 'multipart';

export interface FetchAction<TPayload = any> extends Action<TPayload> {
  uri?: string | UriFunction;
  method?: MethodType;
  format?: FormatType;
  data?: any | DataFunction;
  response?: any;
  status?: string;
}
