# Currency converter API

## How to start the server
### with docker:
```
docker pull tibalt/currency
docker run -d -p 8080:8080 --name currency tibalt/currency
```

### manually:
`yarn` or `npm i`
then `yarn start` or `npm start`
 
## How to convert 10 euros to us dollars
In the browser, postman, curl or whatever make this request:
```
localhost:8080/eur/10/usd
```

## How to test
`yarn test` or `npm test`
