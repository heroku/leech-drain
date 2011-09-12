(ns leech.web
  (:require [cljs.nodejs :as node]))

(def http (node/require "http"))

(defn start []
  ; get /
  (if (auth?)
    (send-index conn)
    (send-not-authorized conn)))
  ; put /searches/id


(util/main "web" start)
