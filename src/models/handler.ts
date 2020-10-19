import { FetchActionHandlerOptions } from './options'
import { FetchAction } from './action'
import { BaseModel, BaseState } from './state'

export interface FetchActionHandler<TModel extends BaseModel, TPayload = {}> {
  options: FetchActionHandlerOptions<TModel>
  check(action: FetchAction<TPayload>): Boolean

  handle(state:BaseState<TModel>, action:FetchAction<TPayload>): BaseState<TModel>

  modify(item:TModel):TModel|TModel[]
  
  getMixin(state: BaseState<TModel>, action: FetchAction<TPayload>): any

  success(state: BaseState<TModel>, action:FetchAction<TPayload>): BaseState<TModel>
  failure(state: BaseState<TModel>, action:FetchAction<TPayload>): BaseState<TModel>
  do(state: BaseState<TModel>, action:FetchAction<TPayload>): BaseState<TModel>
}
