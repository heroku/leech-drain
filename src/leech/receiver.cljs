(ns leech.receiver
  (:require [leech.conf :as conf]
            [leech.util :as util]
            [leech.io :as io]
            [leech.parse :as parse]))

(defn log [data]
  (util/log (merge {:ns "receiver"} data)))

(defn start [& _]
  (let [received-count-a (atom 0)]
    (log {:fn "start" :event "start"})
    (util/set-interval 1000 (fn []
      (log {:fn "start" :event "watch" :received-count (deref received-count-a)})))
    (log {:fn "start" :event "watching"})
    (io/start-bleeders (conf/aorta-urls) (fn [host line]
      (let [parsed (parse/parse-line line)]
        (when (nil? parsed)
          (log {:fn "start" :event "failed" :host host :line line})))
      (swap! received-count-a inc)))
    (log {:fn "start" :event "bleeding"})
    (doseq [signal ["TERM" "INT"]]
      (util/trap signal (fn []
        (log {:fn "start" :event "catch" :signal signal})
        (log {:fn "start" :event "exit" :status 0})
        (util/exit 0)))
      (log {:fn "start" :event "trapping" :signal signal}))))

(util/main "receiver" start)
