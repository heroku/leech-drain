(ns leech.split
  (:require [clojure.string :as str]))

(defn init []
  (atom ""))

(defn add [buff-a data f]
  (let [buff-mid (str (deref buff-a) data)
        parts (str/split buff-mid #"\n")]
    (doseq [part (butlast parts)] (f part))
    (swap! buff-a (constantly (last parts)))))
