# Leech

Leech events from the Heroku event stream.


## Running locally

Compile the app:

    $ cljsc src \
        '{:optimizations :simple :pretty-print true :target :nodejs}' \
        > out/leech.js

Run a namespace:

    $ bin/leech parse


## Running as Heroku app

    $ heroku create leech-mark --stack cedar
    $ heroku addons:add redistogo:medium
    $ heroku config:add \
        AORTA_URLS="aorta://..." \
        REDIS_URL="redis://redistogo:..."
    $ git push heroku master
    $ heroku scale receive=16 web=2


## Tail usage

Point to a Leech server:

    $ export LEECH_URL=https://user:pass@leech-production.herokuapp.com/events

Show all logs for a given dev cloud:

    $ bin/leech tail --cloud mark.herokudev.com
    # (tail ["=" "cloud" "mark.herokudev.com"])

Show all logs across specific components for a given dev cloud:

    $ bin/leech tail --cloud mark.herokudev.com --components core,psmgr,runtime
    # (tail ["and"
              ["=" "cloud" "mark.herokudev.com"]
              ["or"
                ["=" "component" "core"]
                ["=" "component" "psmgr"]
                ["=" "component" "runtime"]]])

Show all error-level logs for a given dev cloud:

    $ bin/leech tail --cloud mark.herokudev.com --level error
    # (tail ["and"
              ["=" "cloud" "mark.herokudev.com"]
              ["=" "level" "error"]])

Disable colorization:

    $ bin/leech tail --cloud mark.herokudev.com --no-color
