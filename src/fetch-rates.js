'use strict';

const { promisify } = require('util');
const parseXml = promisify(require('xml2js').parseString);
const fetch = require('node-fetch');
const _ = require('lodash');

const defaultCurrency = 'EUR';
const updateIntervalMs = 30*1000;

let cacheUpdatedAt;
let cachedRates;

module.exports = (config) => {
  const endpoint = _.get(config, 'service.endpoint');
  const ratesUrl = _.get(config, `service.urls.${defaultCurrency}`);

  if (!endpoint || !ratesUrl) {
    return Promise.reject('Invalid service config');
  }

  if (cachedRates && (Date.now() - cacheUpdatedAt < updateIntervalMs)) {
    console.log('Use cached rates');
    return Promise.resolve(cachedRates);
  } else {
    return fetch(`${endpoint}${ratesUrl}`)
      .then(extractBody)
      .then(parseXml)
      .then(parsed => {
        console.log('Update cached rates');
        cachedRates = rates(parsed);
        cacheUpdatedAt = Date.now();

        return cachedRates;
      });
  }
};

function extractBody(response) {
  if (response.ok) {
    console.log('Rates received.');
    return response.text();
  } else {
    throw response.statusText;
  }
}

function rates(parsedResponse) {
  return _.get(parsedResponse, '[gesmes:Envelope].Cube[0].Cube[0].Cube', []).reduce((res, cur) => {
    const { currency, rate } = cur.$;

    return { ...res, ...{ [currency]: Number(rate) } };
  }, { [defaultCurrency]: 1 });
}
