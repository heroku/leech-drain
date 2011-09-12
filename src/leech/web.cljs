(ns leech.web
  (:require [cljs.nodejs :as node]
            [leech.conf :as conf]
            [leech.util :as util]))

(def http (node/require "http"))

(defn handle-not-found [conn]
  )

(defn handle-not-authorized [conn]
  )

(defn handle-index [conn]
  )

(def handle-search [conn search-id ]
  )

(defn handle [conn]
  ; get /
  (if (auth?)
    (handle-index conn)
    (handle-not-authorized conn))
  ; get /searches/id
  (if (auth?)
    (handle-search conn)
    (handle-not-authorized conn))
  ; else
  (handle-not-found conn))

(defn listen [handle-fn port callback]
  (log {:fn "listen" :at "start" :port port})
  (let [server (.createServer http handle-fn)]
    (.on server "clientError" (fn [e]
      (log {:fn "listen" :at "error" :name (.name e) :message (.message e)})))
    (.listen server port "0.0.0.0" #(callback server))
    (log {:fn "listen" :at "finish"})))

(defn close [server]
  (log {:fn "close" :at "start"})
  (.close server)
  (log {:fn "close" :at "finish"}))

(defn start []
  (let [port (conf/port)]
    (log {:fn "start" :at "start" :port port})
    (listen handle port (fn [server]
      (log {:fn "start" :at "listening"})
      (doseq [signal ["TERM" "INT"]]
        (util/trap signal (fn []
          (log {:fn "start" :at "catch" :signal signal})
          (close server)
          (log {:fn "start" :at "exit" :status 0})
          (util/exit 0)))
        (log {:fn "start" :at "trapping" :signal signal}))))
    (log {:fn "start" :at "finish"})))

(util/main "web" start)
