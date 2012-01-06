(ns leech.server.log
  (:require [cljs.nodejs :as node]
            [clojure.string :as string]
            [leech.server.conf :as conf]))

(defn log
  "Log the given data."
  [data]
  (prn (merge {:app "leech" :deploy (conf/deploy)} data)))
