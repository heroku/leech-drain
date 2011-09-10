(ns leech.receiver
  (:require [leech.conf :as conf])
  (:require [leech.util :as util])
  (:require [leech.queue :as queue])
  (:require [leech.io :as io])
  (:require [leech.parse :as parse]))

(defn log [msg & args]
  (apply util/log (str "bleeder " msg) args))

(defn init-receiver [receive-queue publish-queue]
  (log "init_receiver")
  (util/spawn-loop (fn []
    (let [[_ line] (queue/take receive-queue)]
      (when-let [parsed (parse/parse-line line)]
        (when (= (conf/cloud) (:cloud parsed))
           (queue/offer publish-queue (assoc parsed :line line))))))))

(defn -main []
  (log "init event=start")
  (let [receive-queue (queue/init 20000)
        publish-queue (queue/init 1000)]
    (queue/init-watcher receive-queue "receive")
    (queue/init-watcher publish-queue "publish")
    (io/init-publishers publish-queue (conf/redis-url) "event.received" 4)
    (init-receiver receive-queue publish-queue)
    (io/init-bleeders (conf/aorta-urls) receive-queue))
  (log "init event=finish"))
