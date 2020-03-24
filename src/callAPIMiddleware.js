import qs from 'query-string';
import { jsonToFormData } from './utils';

const APPLICATION_JSON = 'application/json';

const dataConverters = {
  json: JSON.stringify,
  multipart: jsonToFormData
};

function getQueryParams(qdata) {
  const res = {};
  for (const key in qdata) {
    if (qdata[key] !== null && typeof qdata[key] !== 'undefined' && qdata[key] !== '') {
      res[key] = qdata[key];
    }
  }
  const params = qs.stringify(res);
  return params ? '?' + params : '';
}

function getBody(method, qdata, format) {
  try {
    return method && method !== 'GET' && method !== 'DELETE' ? dataConverters[format](qdata) : null;
  } catch (e) {
    console.log(qdata);
    throw e;
  }
}


function prepareResponse(response) {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.indexOf(APPLICATION_JSON) !== -1) {
    return response.json();
  } else {
    return response.text();
  }
}

// TODO: Move to configuration?
const preprocessResponse = (requestUrl, dispatch) => (response) => {
  switch(response.status) {
    case 401:
      return Promise.reject();
    case 404:
      return Promise.reject();
    case 400:
      return response.json().then(body => ({
        error: true,
        body
      }));
    case 403:
      return response.json();
    case 409:
      return response.json();
    case 204: 
      return Promise.resolve({});
  }

  if (response.status !== 200 && response.status !== 201) {
    return Promise.reject();
  }
  return prepareResponse(response);
}

const processResponse = (dispatch, mixin) => response => {
  if (response.error) {
    return dispatch({
      error: response.error,
      status: 'error',
      response: response.body,
      ...mixin
    });
  } else {
    return dispatch({
      response,
      status: 'success',
      ...mixin
    });
  }
}

const processError = (dispatch, mixin) => result => {
  return dispatch({
    error: result.error,
    status: 'error',
    ...mixin
  });
}

function getAuthorization(token) {
  return token ? { Authorization: `Token ${token}` } : {}
}

function resolveRequestUrl(uri, state) {
  return typeof uri === 'function' ? uri(state) : `${uri}`
}

function resolveQData(data, state) {
  return typeof data === 'function' ? data(state) : data;
}

const headersCases = {
  json: {
    Accept: APPLICATION_JSON,
    'Content-Type': APPLICATION_JSON,
    Pragma: 'no-cache',
  },
  multipart: {
    Pragma: 'no-cache'
  }
};

const callAPIMiddleware = ({ dispatch, getState }) => next => action => {
  const {
    type,
    uri,
    data,
    method: inputMethod,
    format = 'json',
    shouldCallAPI = () => true,
    payload = {}
  } = action;

  if (!inputMethod && !uri) {
    return next(action);
  }

  const method = inputMethod.toUpperCase();

  const state = getState();

  if (!shouldCallAPI(state)) {
    return;
  }

  dispatch({
    type,
    payload
  });

  let requestUrl = resolveRequestUrl(uri, state);

  if (requestUrl === false) {
    return dispatch({
      payload,
      error: true,
      status: 'error',
      type
    });
  }

  const qdata = resolveQData(data, state);

  if (!method || method === 'GET' || method === 'DELETE') {
    requestUrl += getQueryParams(qdata);
    console.log(requestUrl);
  }

  const body = getBody(method, qdata, format);

  const headers = {
    ...headersCases[format],
    ...getAuthorization(state.Session.token)
  };

  return fetch(requestUrl, {
    method,
    headers,
    body
  })
    .then(preprocessResponse(requestUrl, dispatch))
    .then(processResponse(dispatch, { payload, type }))
    .catch(processError(dispatch, { payload, type }));
}

export default callAPIMiddleware;