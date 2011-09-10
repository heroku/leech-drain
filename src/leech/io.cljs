; TODO
(ns leech.io
  (:require [cljs.nodejs :as node]
            [leech.util :as util]
            [leech.queue :as queue]
            [clj-redis.client :as redis]))

(defn log [data]
  (util/log (merge {:ns "io"} data)))

(defn bleed [aorta-url handler]
  (let [{:keys [host port auth]} (util/url-parse aorta-url)]
    (loop []
      (log {:fn "bleed" :event "connect" :host host})
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
        (util/log {:fn "bleed" :event "eof" :host host})
        (catch ConnectException e
          (util/log {:fn "bleed" :event "error" :host host})))
      (Thread/sleep 100)
      (recur))))

(defn init-bleeders [aorta-urls q]
  (log {:fn "init-bleeders" :event "start"}
  (doseq [aorta-url aorta-urls]
    (let [{:keys [host]} (util/url-parse aorta-url)]
      (log {:fn "init-bleeder" :event "bleed" :host host})
      (bleed aorta-url (fn [line]
        (queue/offer q [host line])))))))
