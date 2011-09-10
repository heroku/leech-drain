; PENDING
(ns leech.redis
  (:require [cljs.nodejs :as node]))

(def node-redis (node/require "redis"))

(defn start-publishers [publish-queue redis-url chan workers])

;(let [redis (redis/init {:url redis-url})]
;  (log "start_publishers chan=%s" chan)
;  (dotimes [i workers]
;    (log "start_publisher chan=%s index=%d" chan i)
;    (util/spawn-loop (fn []
;      (let [data (queue/take publish-queue)
;            data-str (try
;                       (json/generate-string data)
;                       (catch Exception e
;                         (log "publish event=error data=%s" (pr-str data))
;                         (throw e)))]
;        (redis/publish redis chan data-str)))))))

(defn start-subscriber [redis-url chan receive-fn])

; (let [redis (redis/start {:url redis-url})]
;   (redis/subscribe redis [chan]
;     (fn [_ data-json]
;       (receive-fn (util/json-parse data-json))))))
