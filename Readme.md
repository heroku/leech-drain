# Leech

Leech events from the Heroku event stream.


## Running as Heroku app

    $ heroku create leech-mark --stack cedar
    $ heroku config:add \
        AORTA_URLS="aorta://..." \
        CLOUD="mark.herokudev.com"
    $ git push heroku master
    $ heroku scale receiver=10 web=0
    $ heroku logs --tail
