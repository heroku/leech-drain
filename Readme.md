# Leech Drain

## Overview

Leech provides web-accessible, real-time filtered views of the Heroku event stream. This provides instant visibility into specific aspects of the Heroku infrastructure and its operations. Leech replaces manual log tailing and filtering.

The Leech drain component consumes the HTTPS event stream, performs filtering, and writes the results to Redis for consumption by by the [Leech drain](https://github.com/heroku/leech-drain) component.


## ClojureScript and Node.js

The Leech drain is written in ClojureScript, and compiles to Node.js for execution. Leech uses the standard Node.js package management system `npm` for its JavaScript dependencies.


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
$ heroku config:add DEPLOY=production REDIS_URL=... AORTA_URLS=...
$ git push heroku master
$ heroku scale drain=32
```


## Updating code

```bash
$ mate .
$ npm install
$ bin/compile
$ git commit -am "update code"
```


## Updating ClojureScript

```bash
$ cd ~/repos/clojurescript
$ git fetch github
$ git merge github/master
$ ./script/bootstrap
$ cd ~/repos/leech
$ bin/compile
$ git commit -am "update clojurescript"
```
