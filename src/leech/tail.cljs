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

(defn log [data]
  (when (conf/leech-log?)
    (util/log (merge {:ns "tail"} data))))

(defn start-traps []
  (log {:fn "start-traps" :at "start"})
  (doseq [signal ["TERM" "INT"]]
    (util/trap signal (fn []
      (log {:fn "start-traps" :at "catch" :signal signal})
      (log {:fn "start-traps" :at "exit" :status 0})
      (util/exit 0)))
    (log {:fn "start-traps" :at "trapping" :signal signal}))
  (log {:fn "start-traps" :at "finish"}))

(defn start-search [search-client {:keys [search-id] :as search-data}]
  (log {:fn "start-search" :at "start"})
  (let [search-str (pr-str search-data)]
    (.on search-client "ready" (fn []
      (log {:fn "start-search" :at "readying"})
      (util/set-interval 0 1000 (fn []
        (log {:fn "start-search" :at "tick"})
        (.zadd search-client "searches" (util/millis) search-str (fn [e r]
          (log {:fn "start-search" :at "post" :e e :r r})))))
      (log {:fn "start" :at "ready" :search-id search-id})))
    (log {:fn "start-search" :at "finish"})))

(defn start-stream [events-client events-key]
  (log {:fn "start-stream" :at "start"})
  (.on events-client "ready" (fn []
    (log {:fn "start-stream" :at "readying"})
    (.subscribe events-client events-key)
    (.on events-client "subscribe" (fn [_]
      (log {:fn "start-stream" :event "subscribed"})))
    (.on events-client "message" (fn [_ event-serialized]
      (let [event-parsed (reader/read-string event-serialized)]
        (let [color (get component-colors (get event-parsed "component") :default)]
          (println (colored color (get event-parsed "line")))))))
    (log {:fn "start-stream" :at "ready"})))
  (log {:fn "start-stream" :at "start"}))

(defn start []
  (log {:fn "start" :at "start"})
  (let [search-id (node-uuid)
        query (str/join " " (drop 3 (util/argv)))
        events-key (str "searches." search-id ".events")
        search-data {:search-id search-id :query query :events-key events-key :target :publish}
        search-client (.createClient redis (conf/redis-url))
        events-client (.createClient redis (conf/redis-url))]
    (start-traps)
    (start-search search-client search-data)
    (start-stream events-client events-key)
    (log {:fn "start" :at "finish"})))

(util/main "tail" start)
