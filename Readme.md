# Leech

Real-time leeching off the Heroku event stream.


## Overview

Leech provides web-accessible, real-time access to filtered views of the Heroku event stream. This provides instant visibility into specific aspects of the Heroku infrastructure and its operations. Leech replaces manual log tailing and filtering.

Leech is inspired by [Pulse](https://github.com/heroku/pulse), consumes the same event stream, and indeed is derived from the original pulse code base.


## ClojureScript and Node.js

Leech is written in ClojureScript, and compiles to Node.js for execution. Leech uses the standard Node.js packagement system `npm` for it's JavaScript dependencies.


## Running locally

Build:

    $ npm install
    $ bin/compile

Configure:

    $ cp .env.sample .env
    $ export $(cat .env)

Run:
    
    $ foreman start


## Running as Heroku app

    $ heroku create leech-production --stack cedar
    $ heroku addons:add redistogo:medium
    $ heroku config:add ...
    $ git push heroku master
    $ heroku scale receive=16 web=1


## Viewing filtered event streams

Navigate to the site:

    $ heroku open

Search using Splunk-like query syntax. For example to see all events from the staging cloud:

    cloud=staging.herokudev.com

To see all exceptions in production:

    cloud=heroku.com facility=user,local3 level=err

To see all events from a given production instance:

    cloud=heroku.com instance_id=12345
