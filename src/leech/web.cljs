(ns leech.web
  (:require [cljs.nodejs :as node]))

(def http (node/require "http"))

(defn start []
  )

(util/main "web" start)
