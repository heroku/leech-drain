(ns leech.tail
  (:require [cljs.nodejs :as node]
            [cljs.reader :as reader]
            [leech.util :as util]
            [leech.conf :as conf]))

(def redis (node/require "redis-url"))

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

(defn start [& _]
  (let [client (.createClient redis (conf/redis-url))]
    (.on client "ready" (fn []
      (.subscribe client "staging")
      (.on client "message" (fn [_ data]
        (let [parsed (reader/read-string data)]
          (println (get parsed "line")))))))))

(util/main "tail" start)
