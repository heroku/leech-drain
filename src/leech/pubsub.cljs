(ns leech.pubsub
  (:require [cljs.nodejs :as node]
            [leech.util :as util]
            [leech.conf :as conf]))

(def redis (node/require "redis-url"))

(defn start [& _]
  (let [client1 (.createClient redis (conf/redis-url))
        client2 (.createClient redis (conf/redis-url))
        msg-count-a (atom 0)]
    (.on client1 "subscribe" (fn [chan val]
      (.publish client2 "test-chan" "send 1")
      (.publish client2 "test-chan" "send 2")
      (.publish client2 "test-chan" "send 3")))
    (.on client1 "message" (fn [chan val]
      (println (str "client1 on " chan " got " val))
      (swap! msg-count-a inc)
      (when (= 3 (deref msg-count-a))
        (.unsubscribe client1)
        (.end client1)
        (.enc client2)
        (util/exit 0))))
    (.subscribe client1 "test-chan")))

(util/main "pubsub" start)
