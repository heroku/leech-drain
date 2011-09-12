(ns leech.receive
  (:require [cljs.nodejs :as node]
            [leech.conf :as conf]
            [leech.util :as util]
            [leech.io :as io]
            [leech.parse :as parse]))

(def redis (node/require "redis-url"))

(defn log [data]
  (util/log (merge {:ns "receive"} data)))

(defn start [& _]
  (let [received-count-a (atom 0)
        received-count-prev-a (atom 0)
        published-count-a (atom 0)
        published-count-prev-a (atom 0)
        redis-client (.createClient redis (conf/redis-url))]
    (log {:fn "start" :event "start"})
    (util/set-interval 1000 (fn []
      (let [elapsed (- (util/millis) start)
            received-count (deref received-count-a)
            received-count-prev (deref received-count-prev-a)
            published-count (deref published-count-a)
            published-count-prev (deref published-count-prev-a)
            receive-rate (- received-count received-count-prev)
            publish-rate (- published-count published-count-prev)]
        (log {:fn "start" :event "watch"
              :received-count received-count :receive-rate receive-rate
              :published-count published-count :publish-rate publish-rate})
        (swap! received-count-prev-a (constantly received-count))
        (swap! published-count-prev-a (constantly published-count)))))
    (log {:fn "start" :event "watching"})
    (io/start-bleeders (conf/aorta-urls) (fn [host line]
      (swap! received-count-a inc)
      (if-let [parsed (parse/parse-line line)]
        (if-let [cloud (get parsed "cloud")]
          (if (util/re-match? #"[a-z]+\.herokudev\.com" cloud)
            (swap! published-count-a inc)
            (let [serialized (pr-str parsed)]
              (.publish redis-client "staging" serialized)))))))
    (log {:fn "start" :event "bleeding"})
    (doseq [signal ["TERM" "INT"]]
      (util/trap signal (fn []
        (log {:fn "start" :event "catch" :signal signal})
        (log {:fn "start" :event "exit" :status 0})
        (util/exit 0)))
      (log {:fn "start" :event "trapping" :signal signal}))))

(util/main "receive" start)
