# Leech

Leech events from the Heroku event stream.


## Running locally

Compile the app:

    $ bin/compile

Configure environment:

    $ cp .env.sample .env
    $ export $(cat .env)

Run:
    
    $ foreman start


## Running as Heroku app

    $ heroku create leech-production --stack cedar
    $ heroku addons:add redistogo:medium
    $ heroku config:add \
        AORTA_URLS="aorta://leech-production:...,aorta://leech-production:..." \
        REDIS_URL="redis://redistogo:..."
    $ git push heroku master
    $ heroku scale receive=16


## Leeching events

Point to a Leech Redis:

    $ export REDIS_URL=redis://redistogo:...

Tail with `key=val(,val2(,val3))` syntax:

    $ bin/run tail cloud=heroku.com level=err
