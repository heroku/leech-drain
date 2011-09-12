(ns leech.tail
  (:require [cljs.nodejs :as node]
            [cljs.reader :as reader]
            [clojure.string :as str]
            [leech.util :as util]
            [leech.conf :as conf]
            [leech.parse :as parse]))

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
   "apolo"     :blue
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

(defn start []
  (let [search-str (str/join " "(drop 3 (util/argv)))
        search-parsed (parse/parse-message-attrs search-str)
        client (.createClient redis (conf/redis-url))]
    (.on client "ready" (fn []
      (.subscribe client "events.dev")
      (.on client "message" (fn [_ event-serialized]
        (let [event-parsed (reader/read-string event-serialized)]
          (if (every? (fn [[k v]] (= v (get event-parsed k))) search-parsed)
            (let [color (get component-colors (get event-parsed "component") :default)]
              (println (colored color (get event-parsed "line"))))))))))))

(util/main "tail" start)
