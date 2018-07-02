'use strict';

const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;
const nock = require('nock');

const fetchRates = require('../src/fetch-rates');
const endpoint = "http://some.endpoint";
const url = "/some/url";
const config = {
  service: {
    endpoint,
    urls: {
      EUR: url
    }}
};

describe('fetchRates', () => {
  describe('given no service config', () => {
    it('should reject the promise', () => {
      return expect(fetchRates()).to.eventually.be.rejected;
    });
  });

  describe('given inaccessible server', () => {
    beforeEach(() => {
      nock(endpoint)
        .get(url)
        .replyWithError('No response')
    });

    it('should reject the promise', () => {
      return expect(fetchRates(config)).to.eventually.be.rejected;
    });
  });

  describe('given status 500', () => {
    beforeEach(() => {
      nock(endpoint)
        .get(url)
        .reply(500)
    });

    it('should reject the promise', () => {
      return expect(fetchRates(config)).to.eventually.be.rejected;
    });
  });

  describe('given status 400', () => {
    beforeEach(() => {
      nock(endpoint)
        .get(url)
        .reply(400)
    });

    it('should reject the promise', () => {
      return expect(fetchRates(config)).to.eventually.be.rejected;
    });
  });

  describe('given status 200', () => {
    describe('given invalid xml response', () => {
      beforeEach(() => {
        nock(endpoint)
          .get(url)
          .reply(200, 'not xml')
      });

      it('should reject the promise', () => {
        return expect(fetchRates(config)).to.eventually.be.rejected;
      });
    });

    describe('given valid xml response', () => {
      beforeEach(() => {
        const xml = '<gesmes:Envelope><Cube><Cube time="2018-06-08"><Cube currency="USD" rate="1.1754"/><Cube currency="JPY" rate="128.64"/></Cube></Cube></gesmes:Envelope>';
        nock(endpoint)
          .get(url)
          .reply(200, xml, {
            'Content-Type': 'application/xml'
          })
      });

      it('should parse the xml and add EUR rate', () => {
        const parsed = { EUR: 1, USD: 1.1754, JPY: 128.64 };

        return expect(fetchRates(config)).to.eventually.be.deep.equal(parsed);
      })
    })
  });
});