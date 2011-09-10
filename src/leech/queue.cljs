(ns leech.queue
  (:require [goog.structs.Queue :as Queue]
            [leech.util :as util])
  (:refer-clojure :exclude (take))

(defn init [limit]
  [(structs/Queue.) limit (atom 0) (atom 0) (atom 0)])

(defn offer [[queue limit pushed-a _ dropped-a] elem]
  (if (>= (.getCount queue) limit)
    (swap! dropped-a inc)
    (do
      (swap! pushed-a inc)
      (.enqueue queue elem))))

(defn take [[queue _ _ popped-a _]]
  (when-let [elem (.dequeue queue)]
    (swap! popped-a inc)
    elem))

(defn stats [[queue _ pushed-a popped-a dropped-a]]
  [(.getCount queue) (deref pushed) (deref popped) (deref dropped)])

(defn log [data]
  (util/log (merge {:ns "queue"} data)))

(defn init-watcher [queue queue-name]
  (log {:fn "init-watcher" :name queue-name})
  (let [start (util/millis)
        depth-prev-a   (atom 0)
        pushed-prev-a  (atom 0)
        popped-prev-a  (atom 0)
        dropped-prev-a (atom 0)]
    (util/set-interval 1000 (fn []
      (let [elapsed (- (util/millis) start)
            [depth pushed popped dropped] (stats queue)
            depth-rate   (- depth   (deref depth-prev-a))
            pushed-rate  (- pushed  (deref pushed-prev-a))
            popped-rate  (- popped  (deref popped-prev-a))
            dropped-rate (- dropped (deref dropped-prev-a))]
        (swap! depth-prev-a    (constantly depth))
        (swap! pushed-prev-a   (constantly pushed))
        (swap! popped-prev-a   (constantly popped))
        (swap! dropped-prev-a  (constantly dropped)))
        (log
          {:fn "init-watcher" :name queue-name
           :depth depth :pushed pushed :popped popped :dropped dropped
           :depth-rate depth-rate :pushed-rate pushed-rate
           :popped-rate popped-rate :dropped-rate dropped-rate})))))