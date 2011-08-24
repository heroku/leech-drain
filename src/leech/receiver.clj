(ns leech.receiver
  (:require [leech.conf :as conf])
  (:require [leech.util :as util])
  (:require [leech.queue :as queue])
  (:require [leech.io :as io])
  (:require [leech.parse :as parse]))

(defn log [msg & args]
  (apply util/log (str "bleeder " msg) args))

(defn init-receiver [receive-queue]
  (log "init_receiver")
  (util/spawn-loop (fn []
    (let [[_ line] (queue/take receive-queue)]
      (when-let [parsed (parse/parse-line line)]
        (when (= (conf/cloud) (:cloud parsed))
          (log (pr-str parsed))))))))

(defn -main []
  (log "init event=start")
  (let [receive-queue (queue/init 20000)]
    (queue/init-watcher receive-queue "receive")
    (io/init-bleeders (conf/aorta-urls) receive-queue)
    (init-receiver receive-queue))
  (log "init event=finish"))
