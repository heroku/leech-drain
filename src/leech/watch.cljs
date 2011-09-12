(ns leech.watch
  (:require [leech.util :as util]))

(defn init []
  [(atom 0) (atom 0) (atom (util/millis))])

(defn hit [[total-a prev-a]]
  (swap! total-a inc))

(defn tick [[total-a prev-a]]
  (let [total (deref total-a)
        prev  (deref prev-a)]
    (swap! prev-a (constantly total))
    (- total prev)))
