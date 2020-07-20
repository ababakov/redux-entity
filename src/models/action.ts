export default interface RequestAction {
  type: String;
  uri: String;
  method: String;
  format: String;
  data: any;
  payload: any;
  response: any;
  status: String;
}
