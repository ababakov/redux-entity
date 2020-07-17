import RequestActionHandlerOptions from './options';
import RequestAction from './action';

export default interface RequestActionHandler {
  options: RequestActionHandlerOptions;
  check(action: RequestAction): Boolean;

  handle();
  modify();
  getMixin();

  success();
  failure();
  request();
}
