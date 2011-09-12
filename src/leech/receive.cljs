(ns leech.receive
  (:require [cljs.nodejs :as node]
            [leech.conf :as conf]
            [leech.util :as util]
            [leech.watch :as watch]
            [leech.io :as io]
            [leech.parse :as parse]))

(def redis (node/require "redis-url"))

(defn log [data]
  (util/log (merge {:ns "receive"} data)))

(defn start [& _]
  (let [receive-watch (watch/init)
        publish-watch (watch/init)
        redis-client (.createClient redis (conf/redis-url))]
    (log {:fn "start" :event "start"})
    (util/set-interval 1000 (fn []
      (let [[received-count receive-rate] (watch/tick receive-watch)
            [published-count publish-rate] (watch/tick publish-watch)]
        (log {:fn "start" :event "watch"
              :received-count received-count :receive-rate receive-rate
              :published-count published-count :publish-rate publish-rate}))))
    (log {:fn "start" :event "watching"})
    (io/start-bleeders (conf/aorta-urls) (fn [host line]
      (watch/hit receive-watch)
      (let [parsed (parse/parse-line line)
            cloud (get parsed "cloud")]
        (when (and cloud (util/re-match? #"\.herokudev\.com" cloud))
          (watch/hit publish-watch)
          (let [serialized (pr-str parsed)]
            (.publish redis-client "events.dev" serialized))))))
    (log {:fn "start" :event "bleeding"})
    (doseq [signal ["TERM" "INT"]]
      (util/trap signal (fn []
        (log {:fn "start" :event "catch" :signal signal})
        (log {:fn "start" :event "exit" :status 0})
        (util/exit 0)))
      (log {:fn "start" :event "trapping" :signal signal}))))

(util/main "receive" start)
