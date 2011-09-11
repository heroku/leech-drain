(ns leech.staging
  (:require [cljs.nodejs :as node]
            [leech.util :as util]
            [leech.conf :as conf]))

(def redis (node/require "redis-url"))

(defn start [& _]
  (let [client (.createClient redis (conf/redis-url))]
    (.on client "ready" (fn []
      (.subscribe client "staging")
      (.on client "message" (fn [_ data]
        (let [parsed (util/json-parse data)]
          (println (get parsed "line")))))))))

(util/main "staging" start)
