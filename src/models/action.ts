// Basic redux action
export interface Action<TPayload> {
  type: string;
  payload: TPayload;
}

export interface FetchAction<TPayload> extends Action<TPayload> {
  uri: string;
  method: string;
  format: string;
  data?: any;
  response?: any;
  status?: string;
}
