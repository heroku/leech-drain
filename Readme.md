# Leech

Real-time leeching off the Heroku event stream.


## Overview

Leech provides web-accessible, real-time filtered views of the Heroku event stream. This provides instant visibility into specific aspects of the Heroku infrastructure and its operations. Leech replaces manual log tailing and filtering.

Leech is inspired by [Pulse](https://github.com/heroku/pulse), consumes the same event stream, and indeed is derived from the original pulse code base.


## ClojureScript and Node.js

Leech is written in ClojureScript, and compiles to Node.js for execution. Leech uses the standard Node.js packagement system `npm` for it's JavaScript dependencies.


## Local deploy

```bash
$ npm install
$ cp .env.sample .env
$ export $(cat .env)
$ foreman start
```


## Platfrom deploy

```bash
$ heroku create leech-production --stack cedar
$ heroku addons:add redistogo:medium
$ heroku config:add ...
$ git push heroku master
$ heroku scale receive=16 web=1
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


## Viewing filtered event streams

Navigate to the site:

```bash
$ heroku open
```

Search using Splunk-like query syntax. For example to see all events from the staging cloud:

```
cloud=staging.herokudev.com
```

To see all exceptions in production:

```
cloud=heroku.com facility=user,local3 level=err
```

To see all events from a given production instance:

```
cloud=heroku.com instance_id=12345
```
