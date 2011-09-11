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
    (io/start-bleeders (conf/aorta-urls) (fn [host line]
      (when (zero? (rand-int 1000))
        (let [parsed (parse/parse-line line)]
          (log {:fn "start" :event "peek" :host host :line line :parsed parsed})))
      (swap! received-count-a inc)))))

(util/main "receiver" start)
