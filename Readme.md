# Leech

Leech events from the Heroku event stream.


## Running as Heroku app

    $ heroku create leech-mark --stack cedar
    $ heroku addons:add redistogo:medium
    $ heroku config:add \
        AORTA_URLS="aorta://..." \
        REDIS_URL="redis://redistogo:..." \
        CLOUD="mark.herokudev.com"
    $ git push heroku master
    $ heroku scale receiver=10
    $ export $(cat .env)
    $ lein run -m leech.term
