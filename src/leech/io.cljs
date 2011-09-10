; TODO
(ns leech.io
  (:require [leech.util :as util])
  (:require [clj-json.core :as json])
  (:require [clj-redis.client :as redis])
  (:import (clojure.lang LineNumberingPushbackReader))
  (:import (java.io InputStreamReader BufferedReader PrintWriter))
  (:import (java.net Socket ConnectException)))

(defn log [data]
  (util/log (merge {:ns "io"} data)))

(defn bleeder [aorta-url handler]
  (let [{:keys [^String host ^Integer port auth]} (util/url-parse aorta-url)]
    (loop []
      (log "bleed event=connect aorta_host=%s" host)
      (try
        (with-open [socket (Socket. host port)
                    in     (-> (.getInputStream socket) (InputStreamReader.) (BufferedReader.))
                    out    (-> (.getOutputStream socket) (PrintWriter.))]
          (.println out auth)
          (.flush out)
          (loop []
            (when-let [line (.readLine in)]
              (handler line)
              (recur))))
        (util/log "bleed event=eof aorta_host=%s" host)
        (catch ConnectException e
          (util/log "bleed event=exception aorta_host=%s" host)))
      (Thread/sleep 100)
      (recur))))

(defn init-bleeders [aorta-urls apply-queue]
  (log "init_bleeders")
  (doseq [aorta-url aorta-urls]
    (let [{aorta-host :host} (util/url-parse aorta-url)]
      (log "init_bleeder aorta_host=%s" aorta-host)
      (util/spawn (fn []
        (bleeder aorta-url (fn [line]
          (queue/offer apply-queue [aorta-host line]))))))))
