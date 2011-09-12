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
        redis-client (.createClient redis (conf/redis-url))]
    (log {:fn "start" :event "start"})
    (util/set-interval 1000 (fn []
      (let [elapsed (- (util/millis) start)
            received-count (deref received-count-a)
            received-count-prev (deref received-count-prev-a)
            receive-rate (- received-count received-count-prev)]
        (log {:fn "start" :event "watch" :received-count received-count :receive-rate receive-rate})
        (swap! received-count-prev-a (constantly received-count)))))
    (log {:fn "start" :event "watching"})
    (io/start-bleeders (conf/aorta-urls) (fn [host line]
      (let [parsed (parse/parse-line line)
            cloud (get parsed "cloud")]
        (when (and cloud (util/re-match? #"\.herokudev\.com" cloud))
          (let [serialized (pr-str parsed)]
            (.publish redis-client "devcloud" serialized))))
      (swap! received-count-a inc)))
    (log {:fn "start" :event "bleeding"})
    (doseq [signal ["TERM" "INT"]]
      (util/trap signal (fn []
        (log {:fn "start" :event "catch" :signal signal})
        (log {:fn "start" :event "exit" :status 0})
        (util/exit 0)))
      (log {:fn "start" :event "trapping" :signal signal}))))

(util/main "receive" start)
