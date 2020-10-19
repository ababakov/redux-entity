
export type ID = string | number

export interface BaseModel {
  id: ID
}

export type DB<TModel> = { [K in ID]: TModel } 
export type LoadingDB = { [K in ID]: boolean } 

export interface BaseState<TModel extends BaseModel> {
  list?: ID[]                // list of ids
  db: DB<TModel> // id to item dictionary
  loadingDB: LoadingDB
  count?: number
  loading: boolean
  error: any
  prevPayload: any
  page?: number
  page_size?: number
  pages_count?: number
}

