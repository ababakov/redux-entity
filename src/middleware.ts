import * as qs from 'query-string';
import { FetchAction, FormatType } from './models/action';
import { jsonToFormData } from './utils';
import { Dispatch, Middleware } from 'redux';

const APPLICATION_JSON = 'application/json';

const HEADERS: { [K in FormatType]: any } = {
  json: {
    Accept: APPLICATION_JSON,
    'Content-Type': APPLICATION_JSON,
    Pragma: 'no-cache',
  },
  multipart: {
    Pragma: 'no-cache',
  },
};

type FormatFunction = (data: any) => string;

const CONVERTERS: { [K in FormatType]: FormatFunction } = {
  json: JSON.stringify,
  multipart: jsonToFormData,
};

function packQueryParams(params: any) {
  const result: any = {};
  for (const key in params) {
    // filter null and undefined and empty string
    if (params[key] !== null && typeof params[key] !== 'undefined' && params[key] !== '') {
      result[key] = params[key];
    }
  }
  const packed = qs.stringify(result);
  return packed ? '?' + packed : '';
}

function packBody(method: string, qdata: any, format: FormatType) {
  try {
    return method !== 'GET' && method !== 'DELETE' ? CONVERTERS[format](qdata) : null;
  } catch (e) {
    console.log(qdata);
    throw e;
  }
}

function prepareResponse(response: any) {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.indexOf(APPLICATION_JSON) !== -1) {
    return response.json();
  } else {
    return response.text();
  }
}

// TODO: Move to configuration?
const preprocessResponse = () => (response: Response) => {
  switch (response.status) {
    case 401:
    case 404:
      return Promise.reject();
    case 400:
      return response.json().then((body: any) => Promise.reject(body));
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

const processResponse = (dispatch: (_: any) => any, mixin: any) => (response: any) => {
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

const processError = (dispatch: Dispatch, mixin: any) => (reason: any) => {
  return dispatch({
    error: reason.error,
    status: 'error',
    ...mixin,
  });
};

function callOrReturn(item: any, args: any[]) {
  return typeof item === 'function' ? item(...args) : item;
}

type BuildRequestFunction = (state: any, action: FetchAction) => [string, RequestInit?];

const buildRequest: BuildRequestFunction = (state: any, action: FetchAction) => {
  const {
    type,
    uri,
    method: inputMethod,
    // ignore = () => false,
    format = 'json',
    data,
    payload = {},
  } = action;

  const method = inputMethod!.toUpperCase();

  const params = callOrReturn(data, [state]);
  const input = callOrReturn(uri, [state]) + (method === 'GET' || method === 'DELETE' ? packQueryParams(params) : '');
  const body = packBody(method, params, format);
  const headers = HEADERS[format];

  const init = {
    method,
    headers,
    body,
  };

  return [input, init];
};

interface FetchMiddlewareOptions {
  buildRequest: BuildRequestFunction;
}

const defaultOptions: FetchMiddlewareOptions = { buildRequest };

type FetchMiddlewareFunction = (options?: FetchMiddlewareOptions) => Middleware;

export const middleware: FetchMiddlewareFunction = (options) => {
  options = { ...defaultOptions, ...options };

  const { buildRequest } = options;

  return ({ dispatch, getState }) => (next) => (action: FetchAction) => {
    const { type, uri, method: inputMethod, payload = {} } = action;

    // bypass default actions
    if (!inputMethod && !uri) {
      return next(action);
    }

    dispatch({ type, payload });

    const requestArgs = buildRequest(getState(), action);

    return fetch(new Request(...requestArgs))
      .then(preprocessResponse())
      .then(processResponse(dispatch, { payload, type }))
      .catch(processError(dispatch, { payload, type }));
  };
};
