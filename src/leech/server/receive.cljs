(ns leech.server.receive
  (:require [cljs.nodejs :as node]
            [cljs.reader :as reader]
            [clojure.string :as str]
            [leech.server.conf :as conf]
            [leech.server.util :as util]
            [leech.server.log :as log]
            [leech.server.watch :as watch]
            [leech.server.io :as io]
            [leech.server.parse :as parse]))

(def redis (node/require "redis-url"))

(defn log [data]
  (log/log (merge {:ns "receive"} data)))

(def max-match-rate 25)

(defn compile-pred [query]
  (let [crits (parse/parse-message-attrs query)]
    (reduce
      (fn [p [crit-k crit-v]]
        (let [crit-p (if (or (not (string? crit-v)) (= 1 (count (str/split crit-v ","))))
                       (let [crit-c (parse/coerce-val crit-v)]
                         (fn [evt] (= (get evt crit-k) crit-c)))
                       (let [crit-s (set (map parse/coerce-val (str/split crit-v ",")))]
                         (fn [evt] (contains? crit-s (get evt crit-k)))))]
          (fn [evt] (and (p evt) (crit-p evt)))))
      (constantly true)
      crits)))

(defn start-traps []
  (log {:fn "start-traps" :at "start"})
  (doseq [signal ["TERM" "INT"]]
    (util/trap signal (fn []
      (log {:fn "start-traps" :at "catch" :signal signal})
      (log {:fn "start-traps" :at "exit" :status 0})
      (util/exit 0)))
    (log {:fn "start-traps" :at "trapping" :signal signal}))
  (log {:fn "start-traps" :at "finish"}))

(defn start-watches [searches-a receive-watch publish-watch]
  (log {:fn "start-watches" :at "start"})
  (util/set-interval 0 1000 (fn []
    (let [[received-count receive-rate] (watch/tick receive-watch)
          [published-count publish-rate] (watch/tick publish-watch)]
      (log {:fn "start-watches" :at "watch-global"
            :received-count received-count :receive-rate receive-rate
            :published-count published-count :publish-rate publish-rate}))
    (doseq [{:keys [search-id query match-watch]} (deref searches-a)]
      (let [[matched-count match-rate] (watch/tick match-watch)]
        (log {:fn "start-watches" :at "watch-search" :search-id search-id :query query
              :matched-count matched-count :match-rate match-rate})))))
  (log {:fn "start-watches" :event "finish"}))

(defn start-searches [searches-a redis-client]
  (log {:fn "start-searches" :at "start"})
  (.on redis-client "ready" (fn []
    (log {:fn "start-searches" :at "readying"})
    (util/set-interval 0 250 (fn []
      (.zrangebyscore redis-client "searches" (- (util/millis) 3000) (+ (util/millis) 3000) (fn [err res]
        (let [searches-data (map reader/read-string res)
              changed (not= (map :search-id (deref searches-a)) (map :search-id searches-data))]
          (when changed
            (let [searches (map
                             (fn [{:keys [search-id query target events-key]}]
                               (let [match-watch (watch/init)
                                     match-pred (compile-pred query)]
                                 {:search-id search-id :query query :target target :events-key events-key :match-watch match-watch :match-pred match-pred}))
                            searches-data)]
              (swap! searches-a (constantly searches)))))))))
    (log {:fn "start-searches" :at "ready"})))
  (log {:fn "start-searches" :at "finish"}))

(defn start-receivers [searches-a redis-client receive-watch publish-watch]
  (log {:fn "start-receivers" :at "start"})
  (io/start-bleeders (conf/aorta-urls) (fn [host line]
     (watch/hit receive-watch)
     (let [event-parsed (parse/parse-line line)]
       (doseq [{:keys [events-key match-pred match-watch target]} (deref searches-a)]
         (when (match-pred event-parsed)
           (watch/hit match-watch)
           (let [match-rate (watch/rate match-watch)]
             (when (< match-rate max-match-rate)
               (watch/hit publish-watch)
               (let [event-serialized (pr-str event-parsed)]
                 (condp = target
                   :list
                     (.rpush redis-client events-key event-serialized)
                   :publish
                     (.publish redis-client events-key event-serialized)
                   (log {:fn "start-receivers" :at "unexpected-target" :target target}))))))))))
  (log {:fn "start-receivers" :at "finish"}))

(defn start []
  (log {:fn "start" :at "start"})
  (let [receive-watch (watch/init)
        publish-watch (watch/init)
        searches-a (atom nil)
        redis-client (.createClient redis (conf/redis-url))]
    (start-traps)
    (start-watches searches-a receive-watch publish-watch)
    (start-searches searches-a redis-client)
    (start-receivers searches-a redis-client receive-watch publish-watch)
    (log {:fn "start" :at "finish"})))

(util/main "receive" start)
