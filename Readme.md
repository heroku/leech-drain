# Leech Drain

## Overview

Leech provides web-accessible, real-time filtered views of the Heroku event stream. This provides instant visibility into specific aspects of the Heroku infrastructure and its operations. Leech replaces manual log tailing and filtering.

The Leech drain component consumes the HTTPS event stream, performs filtering, and writes the results to Redis for consumption by by the [Leech drain](https://github.com/heroku/leech-drain) component.


## Local deploy

```bash
$ npm install
$ cp .env.sample .env
$ export $(cat .env)
$ foreman start
```


## Platform deploy

```bash
$ heroku create leech-drain-production --stack cedar
$ heroku config:add DEPLOY=production REDIS_URL=...
$ git push heroku master
$ heroku scale web=32
```

```bash
$ ventricle drains:add https://leech-drain-production.herokuapp.com/events
```
