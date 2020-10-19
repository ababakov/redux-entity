
export type ID = string | number

export interface BaseModel {
  id: ID
}

export interface BaseNormalizedState<TModel extends BaseModel> {
  list: ID[];                // list of ids
  db: { [K in ID]: TModel }; // id to item dictionary
  loading: boolean;
  error: any;
  prevPayload: any;
}

