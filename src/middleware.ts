import * as qs from 'query-string';
import { jsonToFormData } from './utils';

const APPLICATION_JSON = 'application/json';

const dataConverters:any = {
  json: JSON.stringify,
  multipart: jsonToFormData,
};

function getQueryParams(qdata:any) {
  const res:any = {};
  for (const key in qdata) {
    if (qdata[key] !== null && typeof qdata[key] !== 'undefined' && qdata[key] !== '') {
      res[key] = qdata[key];
    }
  }
  const params = qs.stringify(res);
  return params ? '?' + params : '';
}

function getBody(method:string, qdata:any, format:string) {
  try {
    return method !== 'GET' && method !== 'DELETE' ? dataConverters[format](qdata) : null;
  } catch (e) {
    console.log(qdata);
    throw e;
  }
}

function prepareResponse(response:any) {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.indexOf(APPLICATION_JSON) !== -1) {
    return response.json();
  } else {
    return response.text();
  }
}

// TODO: Move to configuration?
const preprocessResponse = () => (response:Response) => {
  switch (response.status) {
    case 401:
    case 404:
      return Promise.reject();
    case 400:
      return response.json().then((body:any) => Promise.reject(body));
    case 403:
    case 409:
      return response.json();
    case 204:
      return Promise.resolve({});
  }

  if (response.status !== 200 && response.status !== 201) {
    return Promise.reject();
  }

  return prepareResponse(response);
};

const processResponse = (dispatch:(_:any) => any, mixin:any) => (response:any) => {
  if (response.error) {
    return dispatch({
      error: response.error,
      status: 'error',
      response: response.body,
      ...mixin,
    });
  } else {
    return dispatch({
      response,
      status: 'success',
      ...mixin,
    });
  }
};

const processError = (dispatch, mixin) => (result) => {
  return dispatch({
    error: result.error,
    status: 'error',
    ...mixin,
  });
};

function defaultResolveRequestInput({ uri }, state) {
  const result = typeof uri === 'function' ? uri(state) : `${uri}`;

  if (typeof result !== 'string') {
    throw Error('Resolve requestUri error');
  }

  return result;
}

function defaultResolveQueryParams({ data }, state) {
  return typeof data === 'function' ? data(state) : data;
}

function defaultResolveHeaders({ format }, state): any {
  function getAuthorization(token) {
    return token ? { Authorization: `Token ${token}` } : {};
  }

  const headersCases = {
    json: {
      Accept: APPLICATION_JSON,
      'Content-Type': APPLICATION_JSON,
      Pragma: 'no-cache',
    },
    multipart: {
      Pragma: 'no-cache',
    },
  };

  return {
    ...headersCases[format],
    ...getAuthorization(state.Session.token),
  };
}




interface Action {
  type: string,
  payload: any
}

interface FetchAction extends Action {
  uri?: string,
  method?: 'GET' | 'POST' | 'DELETE' | 'PATCH',
  format?: 'json' | 'formdata',
}

interface FetchMiddlewareOptions {
  resolveHeaders?:
  resolveQueryParams?:
  resolveRequestInput?:
}

const defaultOptions: FetchMiddlewareOptions = {
  resolveHeaders: defaultResolveHeaders,
  resolveRequestInput: defaultResolveRequestInput,
  resolveQueryParams: defaultResolveQueryParams,
};

// type DispatchFunction = (a: Action) => void
type FetchMiddleware = (options: any) => any

const middleware: FetchMiddleware = (options) => {
  options = { ...defaultOptions, ...options };

  const { resolveHeaders, resolveQueryParams, resolveRequestInput } = options;

  return ({ dispatch, getState }) => (next) => (action: FetchAction) => {
    const { 
      type, 
      uri, 
      method: inputMethod, 
      format = 'json', 
      // ignore = () => false, 
      payload = {} 
    } = action;

    // bypass default actions
    if (!inputMethod && !uri) {
      return next(action);
    }

    const method = inputMethod.toUpperCase();
    const state = getState();

    if (ignore(state)) {
      return;
    }

    // loading start
    dispatch({ type, payload });

    let input = resolveRequestInput(action, state);
    const queryParams = resolveQueryParams(action, state);

    if (method === 'GET' || method === 'DELETE') {
      input += getQueryParams(queryParams);
    }

    const body = getBody(method, queryParams, format);
    const headers = resolveHeaders(action, state);

    const init = {
      method,
      headers,
      body,
    };

    return fetch(input, init)
      .then(preprocessResponse())
      .then(processResponse(dispatch, { payload, type }))
      .catch(processError(dispatch, { payload, type }));
  };
};

export default middleware;
