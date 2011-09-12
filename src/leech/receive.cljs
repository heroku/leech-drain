(ns leech.receive
  (:require [cljs.nodejs :as node]
            [cljs.reader :as reader]
            [leech.conf :as conf]
            [leech.util :as util]
            [leech.watch :as watch]
            [leech.io :as io]
            [leech.parse :as parse]))

(def redis (node/require "redis-url"))

(defn log [data]
  (util/log (merge {:ns "receive"} data)))

(defn start [& _]
  (log {:fn "start" :event "start"})
  (let [searches-a (atom nil)
        preds-a (atom nil)
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
        (log {:fn "start" :event "watch"
              :received-count received-count :receive-rate receive-rate
              :published-count published-count :publish-rate publish-rate}))))
    (log {:fn "start" :event "watches-ready"})
    ; setup searches
    (.on search-client "ready" (fn []
      (util/set-interval 0 100 (fn []
        (log {:fn "start" :event "search-tick" :time (util/millis)})
        (.zrangebyscore search-client "searches" (- (util/millis) 5000) (+ (util/millis) 5000) (fn [e r]
          (let [searches (map reader/read-string r)
                changed (not= (deref searches-a) searches)]
            (log {:fn "start" :event "search-get" :changed changed :num-searches (count searches)})
            (when changed
              (swap! searches-a (constantly searches))
              (prn searches)
              (let [preds (reduce
                            (fn [p {:keys [query id]}]
                              (let [chan (str "searches." id ".events")
                                    crit (parse/parse-message-attrs query)
                                    _ (prn crit)
                                    pred (fn [evt] (every? (fn [[k v]] (= v (get evt k))) crit))]
                                (assoc p chan pred)))
                            {}
                            searches)]
                (swap! preds-a (constantly preds)))))))))
      (log {:fn "start" :event "search-ready"})))
    ; setup bleeders
    (io/start-bleeders (conf/aorta-urls) (fn [host line]
      (watch/hit receive-watch)
      (let [parsed (parse/parse-line line)]
        (doseq [[chan pred] (deref preds-a)]
          (watch/hit publish-watch)
          (let [serialized (pr-str parsed)]
            (.publish events-client chan serialized))))))
    (log {:fn "start" :event "bleeding"})))

(util/main "receive" start)
