(ns leech.pubsub
  (:require [cljs.nodejs :as node]
            [leech.util :as util]
            [leech.conf :as conf]))

(def redis (node/require "redis-url"))

(defn start [& _]
  (let [client1 (.createClient redis (conf/redis-url))
        client2 (.createClient redis (conf/redis-url))
        chan    (str "pubsub-" (rand-int 1000))
        msg-count-a (atom 0)]
    (.on client1 "error" (fn [e]
      (prn "error" (.message e))))
    (.on client1 "subscribe" (fn [_ val]
      (.publish client2 chan "send 1")
      (.publish client2 chan "send 2")
      (.publish client2 chan "send 3")))
    (.on client1 "message" (fn [_ val]
      (println (str "client1 on " chan " got " val))
      (swap! msg-count-a inc)
      (when (= 3 (deref msg-count-a))
        (.unsubscribe client1)
        (.end client1)
        (.end client2)
        (util/exit 0))))
    (.subscribe client1 chan)))

(util/main "pubsub" start)
