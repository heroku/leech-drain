(ns leech.tail
  (:require [cljs.nodejs :as node]
            [cljs.reader :as reader]
            [clojure.string :as str]
            [leech.util :as util]
            [leech.conf :as conf]
            [leech.parse :as parse]))

(def redis (node/require "redis-url"))
(def node-uuid (node/require "node-uuid"))

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

(defn colored
  [color text]
  (str (color-codes color) text (color-codes :default)))

(defn log [data])
  ;(util/log (merge {:ns "tail"} data)))

(defn start []
  (log {:fn "start" :event "start"})
  (let [search-id (node-uuid)
        query (str/join " " (drop 3 (util/argv)))
        search-data {:id search-id :query query :target :pubsub}
        search-str (pr-str search-data)
        events-key (str "searches." search-id ".events")
        search-client (.createClient redis (conf/redis-url))
        events-client (.createClient redis (conf/redis-url))]
    ; setup traps
    (doseq [signal ["TERM" "INT"]]
      (util/trap signal (fn []
        (log {:fn "start" :event "trap"})
        (util/exit 0)))
      (log {:fn "start" :event "trapping" :signal signal}))
    (log {:fn "start" :event "signals-ready"})
    ; setup search
    (.on search-client "ready" (fn []
      (util/set-interval 0 1000 (fn []
        (log {:fn "start" :event "search-tick" :time (util/millis)})
        (.zadd search-client "searches" (util/millis) search-str (fn [e r]
          (log {:fn "start" :event "search-set"})))))
      (log {:fn "start" :event "search-ready" :search-id search-id})))
    ; setup stream
    (.on events-client "ready" (fn []
      (.subscribe events-client events-key)
      (.on events-client "subscribe" (fn [_]
        (log {:fn "start" :event "events-subscribe"})))
      (.on events-client "message" (fn [_ event-serialized]
        (let [event-parsed (reader/read-string event-serialized)]
          (let [color (get component-colors (get event-parsed "component") :default)]
            (println (colored color (get event-parsed "line")))))))
      (log {:fn "start" :event "events-ready"})))))

(util/main "tail" start)
