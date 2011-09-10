(ns leech.split
  (:require [clojure.string :as str]))

(defn init []
  (atom ""))

(defn add [buff-a data f]
  (let [buff-mid (str (deref buff-a) data)
        parts (str/split buff-mid #"\n")
        last-full? (= (.lastIndexOf buff-mid "\n") (dec (.length buff-mid)))]
    (doseq [part (if last-full? parts (butlast parts))] (f part))
    (swap! buff-a (constantly (if last-full? "" (last parts))))))
