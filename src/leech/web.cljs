(ns leech.web
  (:require [cljs.nodejs :as node]
            [leech.conf :as conf]
            [leech.util :as util]))

(def redis (node/require "redis-url"))
(def http (node/require "http"))

(defn write-res [{:keys [res]} status headers body]
  (.writeHead res status (util/clj->js headers))
  (.write res body)
  (. res (end)))

(defn handle-not-found [{:keys [conn-id res]}]
  (log {:fn "handle-not-found" :at "start" :conn-id conn-id})
  (write-res res 404 {"Content-Type" "application/clj"} (pr-str {"error" "not found"}))
  (log {:fn "handle-not-found" :at "finish" :conn-id conn-id}))

(defn handle-not-authorized [{:keys [conn-id res]}]
  (log {:fn "handle-not-authorized" :at "start" :conn-id conn-id})
  (write-res res 403 {"Content-Type" "application/clj"} (pr-str {"error" "not authorized"}))
  (log {:fn "handle-not-authorized" :at "finish" :conn-id conn-id}))

(defn handle-index [{:keys [conn-id res]}]
  )

(defn handle-search [redis-client {:keys [conn-id res]} {:keys [search-id events-key] :as search-data}]
  (let [search-str (pr-str (assoc search-data :target :list))]
    (log {:fn "handle-search" :at "start" :conn-id conn-id :search-id search-id})
    (.. redis-client
      (multi)
      (zadd searches (util/millis) search-str)
      (lrange events-key 0 100000)
      (ltrim events-key 100000 -1)
      (exec (fn [err [_ events-serialized _]]
        (log {:fn "handle-search" :at "execed" :conn-id conn-id :search-id search-id :err err :events-count (count events-serialized)})
        (let [events (map reader/read-string events-serialized)]
          (write-res res 200 {"Content-Type" "application/clj"} (pr-str {:events events})))
        (log {:fn "handle-search" :at "written" :conn-id conn-id :search-id search-id})))
    (log {:fn "handle-search" :at "finish" :conn-id conn-id :search-id search-id}))))

(defn parse-req [req]
  {:method (.method req)
   :path   (.pathname (.parse url (.url req)))})

(defn handle [redis-client {:keys [conn-id req res]}]
  (let [{:keys [method path]} (parse-req req)]
    (log {:fn "handle" :at "start" :conn-id conn-id :method method :path path})
    (condp = [method path]
      ["get" "/"]
        (if (authorized? conn)
          (handle-index conn)
          (handle-not-authorized conn))
      ["post" "/searches"]
        (if (auth?)
          (handle-search redis-client conn search-data)
          (handle-not-authorized conn))
      (handle-not-found conn))
   (log {:fn "handle" :at "finish" :conn-id conn-id})))

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
    (let [redis-client (.createClient redis (conf/redis-url))]
      (.on redis-client "ready" (fn []
        (log {:fn "start" :at "connected"})
        (listen (partial handle redis-client) port (fn [server]
          (log {:fn "start" :at "listening"})
          (doseq [signal ["TERM" "INT"]]
            (util/trap signal (fn []
              (log {:fn "start" :at "catch" :signal signal})
              (close server)
              (log {:fn "start" :at "exit" :status 0})
              (util/exit 0)))
            (log {:fn "start" :at "trapping" :signal signal})))))))
    (log {:fn "start" :at "finish"})))

(util/main "web" start)
