(ns leech.staging
  (:require [cljs.nodejs :as node]
            [leech.util :as util]
            [leech.conf :as conf]))

(def redis (node/require "redis-url"))

(defn start [& _]
  (let [client (.createClient redis (conf/redis-url))]
    (.on client "subscribe" (fn []
      (prn "subscribe")))
    (.on client "message" (fn [_ data]
      (prn "message" data)))
    (.subscribe client "some-chan")))

(util/main "staging" start)
