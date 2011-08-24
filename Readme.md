# Leech

Leech events from the Heroku event stream.


## Running as Heroku app

    $ heroku create leech-mark --stack cedar
    $ heroku addons:add redistogo:small
    $ heroku config:add \
        AORTA_URLS="aorta://..." \
        CLOUD="mark.herokudev.com"
    $ git push heroku master
    $ heroku scale receiver=10
    $ heroku logs --tail
