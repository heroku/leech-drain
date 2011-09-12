(ns leech.watch
  (:require [leech.util :as util]))

(defn init []
  [(atom 0) (atom 0)])

(defn hit [[total-a _]]
  (swap! total-a inc))

(defn tick [[total-a prev-a]]
  (let [total (deref total-a)
        prev  (deref prev-a)]
    (swap! prev-a (constantly total))
    [total (- total prev)]))
