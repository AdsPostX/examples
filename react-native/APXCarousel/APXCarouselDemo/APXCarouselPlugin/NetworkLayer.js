import axios from 'axios';
import {Platform} from 'react-native';
import {USER_AGENTS, DEFAULT_HEADERS, ENVIRONMENT, BASE_URL} from './Constants';

const NetworkLayer = {
  getRequestHeaders: (apiKey, userAgent) => ({
    ...DEFAULT_HEADERS,
    Authorization: `Bearer ${apiKey}`,
    'User-Agent': userAgent,
  }),

  validateRequestMethod: requestMethod => {
    const allowedMethods = ['POST', 'GET', 'PUT', 'DELETE'];
    if (!allowedMethods.includes(requestMethod.toUpperCase())) {
      throw new Error('Invalid request method');
    }
  },

  checkEnvironment: environment => {
    const lowercaseEnvironment = environment && environment.toLowerCase();
    if (
      !lowercaseEnvironment ||
      (lowercaseEnvironment !== 'live' && lowercaseEnvironment !== 'test')
    ) {
      throw new Error(
        'environment must be either "live" or "test" (case insensitive)',
      );
    }
  },

  validateParam: (param, paramName) => {
    if (!param || param.trim() === '') {
      throw new Error(
        `${paramName} is mandatory and cannot be null, undefined, or consist of only spaces`,
      );
    }
  },

  getUserAgent: () => {
    let userAgent = '';
    switch (Platform.OS) {
      case 'ios':
        userAgent = Platform.isPad
          ? USER_AGENTS.ios.ipad
          : USER_AGENTS.ios.iphone;
        break;
      case 'android':
        userAgent = USER_AGENTS.android;
        break;
      default:
        break;
    }
    return userAgent;
  },

  makeGenericApiCall: (
    url,
    requestMethod = 'GET',
    requestHeaders = {},
    requestParameters = {},
  ) => {
    NetworkLayer.validateParam(url);

    NetworkLayer.validateRequestMethod(requestMethod);

    const requestOptions = {
      method: requestMethod,
      headers: requestHeaders,
      data: requestMethod !== 'GET' ? requestParameters : undefined,
    };

    return axios(url, requestOptions);
  },

  makeAPXApiCall: (
    domainPath,
    environment = 'test',
    requestMethod = 'GET',
    requestHeaders = {},
    requestParameters = {},
  ) => {
    NetworkLayer.validateParam(domainPath);

    NetworkLayer.checkEnvironment(environment);

    NetworkLayer.validateRequestMethod(requestMethod);

    if (environment === ENVIRONMENT.test) {
      requestParameters.dev = 1;
    }

    const apiUrl = `${BASE_URL}${domainPath}`;

    const requestOptions = {
      method: requestMethod,
      headers: requestHeaders,
      data: requestMethod !== 'GET' ? requestParameters : undefined,
    };

    return axios(apiUrl, requestOptions);
  },

  trackOfferView: (apiKey, url, requestParameters = {}) => {
    NetworkLayer.validateParam(apiKey);
    NetworkLayer.validateParam(url);

    let userAgent = NetworkLayer.getUserAgent();

    return NetworkLayer.makeGenericApiCall(
      url,
      'GET',
      NetworkLayer.getRequestHeaders(apiKey, userAgent),
      requestParameters,
    );
  },
  getOffers: (apiKey, environment = 'test', requestParameters = {}) => {
    NetworkLayer.validateParam(apiKey);

    NetworkLayer.checkEnvironment(environment);

    let userAgent = NetworkLayer.getUserAgent();

    return NetworkLayer.makeAPXApiCall(
      'native/v1/offers.json',
      environment,
      'POST',
      NetworkLayer.getRequestHeaders(apiKey, userAgent),
      requestParameters,
    );
  },
};

export default NetworkLayer;
