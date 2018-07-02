'use strict';

const express = require('express');

const fetchRates = require('./src/fetch-rates');
const converted = require('./src/converted');
const Db = require('./src/db');
const config = require('./config');

const db = Db(config.db);
const app = express();

app
  .route('/:from/:amount/:to')
  .get((req, res) => {
    const { from, amount, to } = req.params;

    fetchRates(config)
      .then(rates => {
        const precision = config.service.precision;
        const result = converted({ rates, from, to, amount, precision });

        if (result) {
          db.save({ from, to, amount });
          res
            .status(200)
            .json(result);
        } else {
          res
            .status(400)
            .json('Wrong URL params')
        }
      })
      .catch(err => {
        console.error(err);
        res
          .status(500)
          .json('Houston, we have a problem');
      });
  });

app.listen(config.port);

console.log('Server starting on', config.port);

process.on('SIGINT', db.close);
process.on('SIGTERM', db.close);
