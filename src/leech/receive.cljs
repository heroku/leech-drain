(ns leech.receive
  (:require [cljs.nodejs :as node]
            [cljs.reader :as reader]
            [clojure.string :as str]
            [leech.conf :as conf]
            [leech.util :as util]
            [leech.watch :as watch]
            [leech.io :as io]
            [leech.parse :as parse]))

(def redis (node/require "redis-url"))

(defn log [data]
  (util/log (merge {:ns "receive"} data)))

(def max-match-rate 50)

(defn compile-pred [query]
  (let [crits (parse/parse-message-attrs query)]
    (reduce
      (fn [p [crit-k crit-v]]
        (let [crit-p (if (or (not (string? crit-v)) (= 1 (count (str/split crit-v ","))))
                       (fn [evt] (= (get evt crit-k) crit-v))
                       (let [crit-s (apply set (str/split crit-v ","))]
                         (fn [evt] (contains? crit-s (get evt crit-k)))))]
          (fn [evt] (and (p evt) (crit-p evt)))))
      (constantly true)
      crits)))

(defn start [& _]
  (log {:fn "start" :event "start"})
  (let [searches-a (atom nil)
        receive-watch (watch/init)
        publish-watch (watch/init)
        search-client (.createClient redis (conf/redis-url))
        events-client (.createClient redis (conf/redis-url))]
    ; setup traps
    (doseq [signal ["TERM" "INT"]]
      (util/trap signal (fn []
        (log {:fn "start" :event "catch" :signal signal})
        (log {:fn "start" :event "exit" :status 0})
        (util/exit 0))))
    (log {:fn "start" :event "traps-ready" :signal signal})
    ; setup watches
    (util/set-interval 0 1000 (fn []
      (let [[received-count receive-rate] (watch/tick receive-watch)
            [published-count publish-rate] (watch/tick publish-watch)]
        (log {:fn "start" :event "watch-global"
              :received-count received-count :receive-rate receive-rate
              :published-count published-count :publish-rate publish-rate}))
      (doseq [{:keys [id match-watch]} (deref searches-a)]
        (let [[matched-count match-rate] (watch/tick match-watch)]
          (log {:fn "start" :event "watch-search"
                :matched-count matched-count :match-rate match-rate})))))
    (log {:fn "start" :event "watches-ready"})
    ; setup searches
    (.on search-client "ready" (fn []
      (util/set-interval 0 100 (fn []
        (log {:fn "start" :event "search-tick" :time (util/millis)})
        (.zrangebyscore search-client "searches" (- (util/millis) 5000) (+ (util/millis) 5000) (fn [err res]
          (let [searches-data (map reader/read-string res)
                changed (not= (map :id (deref searches-a)) (map :id searches-data))]
            (log {:fn "start" :event "search-get" :changed changed :num-searches (count searches-data)})
            (when changed
              (let [searches (map
                               (fn [{:keys [query id]}]
                                 (let [events-key (str "searches." id ".events")
                                       match-watch (watch/init)
                                       match-pred (compile-pred query)]
                                   {:id id :query query :events-key events-key :match-watch match-watch :match-pred match-pred}))
                              searches-data)]
                (swap! searches-a (constantly searches)))))))))
      (log {:fn "start" :event "search-ready"})))
    ; setup bleeders
    (io/start-bleeders (conf/aorta-urls) (fn [host line]
      (watch/hit receive-watch)
      (let [event-parsed (parse/parse-line line)]
        (doseq [{:keys [events-key match-pred match-watch]} (deref searches-a)]
          (when (match-pred event-parsed)
            (watch/hit match-watch)
            (let [match-rate (watch/rate match-watch)]
              (when (< match-rate max-match-rate)
                (watch/hit publish-watch)
                (let [event-serialized (pr-str event-parsed)]
                  (.publish events-client events-key event-serialized)))))))))
    (log {:fn "start" :event "bleeding"})))

(util/main "receive" start)
