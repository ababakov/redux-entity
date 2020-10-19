import { RequestActionHandlerOptions } from './options'
import { RequestAction } from './action'
import { BaseModel, BaseNormalizedState } from './state'

export interface RequestActionHandler<TModel extends BaseModel> {
  options: RequestActionHandlerOptions<TModel>
  check(action: RequestAction): Boolean

  handle(state:BaseNormalizedState<TModel>, action:RequestAction): BaseNormalizedState<TModel>

  modify(item:any):any|any[]
  
  getMixin(): any

  success(): any
  failure(): any
  request(): any
}
