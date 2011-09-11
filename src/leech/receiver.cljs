(ns leech.receiver
  (:require [leech.conf :as conf]
            [leech.util :as util]
            [leech.queue :as queue]
            [leech.io :as io]
            [leech.parse :as parse]))

(defn log [data]
  (util/log (merge {:ns "receiver"} data)))

(declare receive)

(defn receive [receive-queue]
  (when-let [[_ line] (queue/take receive-queue)]
    (when-let [parsed (parse/parse-line line)]
      (when (= "staging.herokudev.com" (:cloud parsed))
        (util/log {:fn "start-receiver" :event "line" :parsed parsed}))))
  (util/next-tick #(receive receive-queue)))

(defn start-receiver [receive-queue]
  (util/log {:fn "start-receiver" :event "start"})
  (receive receive-queue))

(defn start [& _]
  (log {:fn "start" :event "start"})
  (let [receive-queue (queue/init 20000)]
    (queue/start-watcher receive-queue "receive")
    (start-receiver receive-queue))
    ;(io/start-bleeders (conf/aorta-urls) receive-queue))
  (log {:fn "start" :event "finish"}))

(util/main "receiver" start)
