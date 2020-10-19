
// Basic redux action
export interface Action<TPayload> {
  type: String
  payload?: TPayload
}

export interface FetchAction<TPayload> extends Action<TPayload> {
  uri: String;
  method: String;
  format: String;
  data?: any;
  response?: any;
  status?: String;
}
