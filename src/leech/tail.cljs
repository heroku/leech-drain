(ns leech.tail
  (:require [leech.conf :as conf]
            [leech.util :as util]
            [leech.redis :as redis]))

(def color-codes
  {:red     "\033[31m"
   :green   "\033[32m"
   :yellow  "\033[33m"
   :blue    "\033[34m"
   :magenta "\033[35m"
   :cyan    "\033[36m"
   :default "\033[39m"})

(def component-colors
  {"runtime"   :magenta
   "psmgr"     :magenta
   "codex"     :yellow
   "gitproxy"  :yellow
   "core"      :green
   "memcache"  :green
   "balrog"    :green
   "hermes"    :blue
   "varnish"   :blue
   "nginx"     :blue
   "face"      :blue
   "logplex"   :blue
   "shen"      :red
   "pgmonitor" :red
   "su"        :cyan
   "syslog-ng" :cyan
   "syslog"    :cyan
   "slapd"     :cyan
   "kernel"    :cyan
   "heroku"    :cyan})

(defn- colored
  [color text]
  (str (color-codes color) text (color-codes :default)))

(defn init []
  (redis/init-subscriber (conf/redis-url) "event-received"
    (fn [{:strs [line component]}
         color (get component-colors component)]
      (println (colored color line)))))

(util/main "tail" init)
