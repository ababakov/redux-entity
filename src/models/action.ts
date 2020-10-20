// Basic redux action
export interface Action<TPayload = any> {
  type: string;
  payload?: TPayload;
}

export type UriFunction = (state: any) => string;
export type DataFunction = (state: any) => any;

export type MethodType = 'GET' | 'POST' | 'DELETE' | 'PATCH';
export type FormatType = 'json' | 'multipart';

export interface FetchAction<TPayload = any> extends Action<TPayload> {
  uri?: string | UriFunction;
  method?: MethodType;
  format?: FormatType;
  data?: any | DataFunction;
  response?: any;
  status?: string;
}
