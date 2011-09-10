# Leech

Bleed off dev cloud events from the global Heroku event stream.


## Usage

Point to a leech server:

    $ export LEECH_URL=https://user:pass@leech-production.herokuapp.com/events

Show all logs for a given dev cloud:

    $ leech --cloud mark.herokudev.com
    # (tail ["=" "cloud" "mark.herokudev.com"])

Show all logs across specific components for a given dev cloud:

    $ leech --cloud mark.herokudev.com --components core,psmgr,runtime
    # (tail ["and"
              ["=" "cloud" "mark.herokudev.com"]
              ["or"
                ["=" "component" "core"]
                ["=" "component" "psmgr"]
                ["=" "component" "runtime"]]])

Show all error-level logs for a given dev cloud:

    $ leech --cloud mark.herokudev.com --level error
    # (tail ["and"
              ["=" "cloud" "mark.herokudev.com"]
              ["=" "level" "error"]])

Disable colorization:

    $ leech --cloud mark.herokudev.com --no-color
