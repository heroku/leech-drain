(ns leech.server.io
  (:require [cljs.nodejs :as node]
            [leech.server.util :as util]
            [leech.server.split :as split]))

(def net (node/require "net"))

(defn log [data]
  (util/log (merge {:ns "io"} data)))

(declare bleed)

(defn bleed [aorta-url handler]
  (let [{:keys [host port auth]} (util/url-parse aorta-url)]
    (log {:fn "bleed" :event "start" :host host})
    (let [conn (.createConnection net port host)
          splitter (split/init)]
      (.on conn "connect" (fn []
        (log {:fn "bleed" :event "connect" :host host})))
      (.on conn "data" (fn [data]
        (split/add splitter data (fn [line]
          (handler line)))))
      (.on conn "end" (fn []
        (log {:fn "bleed" :event "end"})))
      (.on conn "error" (fn [e]
        (log {:fn "bleed" :event "error" :name (.name e) :message (.message e)})))
      (.on conn "close" (fn [had-e]
        (log {:fn "bleed" :event "close" :had-error had-e})
        (util/set-timeout 100 (fn []
          (bleed aorta-url handler)))))
      (.setEncoding conn "UTF-8")
      (.write conn (str auth "\n"))
      (.flush conn))))

(defn start-bleeders [aorta-urls handler]
  (log {:fn "start-bleeders" :event "start"}
  (doseq [aorta-url aorta-urls]
    (let [{:keys [host]} (util/url-parse aorta-url)]
      (log {:fn "start-bleeder" :event "bleed" :host host})
      (bleed aorta-url (fn [line]
        (handler host line)))))))
