; TODO
(ns leech.receiver
  (:require [leech.conf :as conf]
            [leech.util :as util]
            [leech.queue :as queue]
            [leech.io :as io]
            [leech.redis :as redis]
            [leech.parse :as parse]))

(defn log [data]
  (util/log (merge {:ns "receiver"} data)))

(defn init-receiver [receive-queue]
  (util/log {:fn "init-receiver" :event "start"})
  (util/spin (fn []
    (let [[_ line] (queue/take receive-queue)]
      (when-let [parsed (parse/parse-line line)]
        (when (= "staging.herokudev.com" (:cloud parsed))
           (queue/offer publish-queue (assoc parsed :line line))))))))

(defn init [& _]
  (log {:fn "init" :event "start"})
  (let [receive-queue (queue/init 20000)
        publish-queue (queue/init 1000)]
    (queue/init-watcher receive-queue "receive")
    (init-receiver receive-queue publish-queue)
    (io/init-publisher publish-queue (conf/redis-url) "event.received")
    (io/init-bleeders (conf/aorta-urls) receive-queue))
  (log "init event=finish"))

(util/main "receiver" init)
