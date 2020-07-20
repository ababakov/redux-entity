import RequestActionHandlerOptions from './options';
import RequestAction from './action';
import BaseNormalizedState from './state';

export default interface RequestActionHandler {
  options: RequestActionHandlerOptions;
  check(action: RequestAction): Boolean;

  handle(state:BaseNormalizedState, action:RequestAction): BaseNormalizedState;
  modify(item:any):any|any[];
  getMixin();

  success();
  failure();
  request();
}
