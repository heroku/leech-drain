(ns leech.server.web
  (:require [cljs.nodejs :as node]
            [cljs.reader :as reader]
            [clojure.string :as string]
            [leech.server.conf :as conf]
            [leech.server.util :as util]))

(def url (node/require "url"))
(def fs (node/require "fs"))
(def node-uuid (node/require "node-uuid"))
(def redis (node/require "redis-url"))
(def http (node/require "http"))
(def connect (node/require "connect"))

(defn log [data]
  (util/log (merge {:ns "web"} data)))

(def redis-client (atom nil))

(defn write-res [{:keys [res]} status headers body]
  (.writeHead res status (util/clj->js headers))
  (.write res body)
  (. res (end)))

(defn handle-not-found [{:keys [conn-id] :as conn}]
  (log {:fn "handle-not-found" :at "start" :conn-id conn-id})
  (write-res conn 404 {"Content-Type" "application/clj"} (pr-str {"error" "not found"}))
  (log {:fn "handle-not-found" :at "finish" :conn-id conn-id}))

(defn handle-not-authorized [{:keys [conn-id] :as conn}]
  (log {:fn "handle-not-authorized" :at "start" :conn-id conn-id})
  (write-res conn 403 {"Content-Type" "application/clj"} (pr-str {"error" "not authorized"}))
  (log {:fn "handle-not-authorized" :at "finish" :conn-id conn-id}))

(defn handle-static [{:keys [conn-id] :as conn} asset]
  (log {:fn "handle-static" :at "start" :conn-id conn-id :asset asset})
  (.readFile fs (str "./public/" asset) (fn [e c]
    (log {:fn "handle-static" :at "read"})
      (write-res conn 200 {"Content-Type" "text/html"} c)))
  (log {:fn "handle-static" :at "finish"}))

(defn handle-search [{:keys [conn-id req res] :as conn}]
  (log {:fn "handle-search" :at "start" :conn-id conn-id})
  (let [search-id (node-uuid)
        query (.. req body query)
        events-key (str "searches." search-id ".events")
        search-data {:search-id search-id :query query :events-key events-key :target :list}
        search-str (pr-str search-data)]
    (.readFile fs "./public/index.html" (fn [e c]
      (log {:fn "handle-search" :at "read" :conn-id conn-id})
      (let [cs (string/replace-first (str c) "LEECH_SEARCH_ID" search-id)]
        (write-res conn 200 {"Content-Type" "text/html"} cs)
        (log {:fh "handle-search" :at "sent" :conn-id conn-id}))))
    (log {:fn "handle-search" :at "finish" :conn-id conn-id})))

;(.. redis-client
;  (multi)
;  (zadd searches (util/millis) search-str)
;  (lrange events-key 0 100000)
;  (ltrim events-key 100000 -1)
;  (exec (fn [err [_ events-serialized _]]
;    (log {:fn "handle-search" :at "execed" :conn-id conn-id :search-id search-id :err err :events-count (count events-serialized)})
;    (let [events (map reader/read-string events-serialized)]
;      (write-res conn 200 {"Content-Type" "application/clj"} (pr-str {:events events})))
;    (log {:fn "handle-search" :at "written" :conn-id conn-id :search-id search-id}))))
;(log {:fn "handle-search" :at "finish" :conn-id conn-id :search-id search-id})))

(defn handle-events [{:keys [conn-id res] :as conn}]
  (log {:fn "handle-events" :at "start" :conn-id conn-id})
  (write-res res 200 {"Content-Type" "application/clj"} (pr-str {:events ["logging all the things"]}))
  (log {:fn "handle-events" :at "finish" :conn-id conn-id}))

(defn parse-req [req]
  {:method (.method req)
   :path   (.pathname (.parse url (.url req)))})

(defn handle-core [req res e]
  (let [conn-id (node-uuid)
        {:keys [method path]} (parse-req req)
        conn {:conn-id conn-id :req req :res res :method method :path path}]
    (log {:fn "handle" :at "start" :conn-id conn-id :method method :path path :e e})
    (cond
      (and (= "GET" method) (= "/" path))
        (handle-static conn "index.html")
      (and (= "GET" method) (= "/leech.css" path))
        (handle-static conn "leech.css")
      (and (= "GET" method) (= "/leech.js" path))
        (handle-static conn "leech.js")
      (and (= "POST" method) (= "/searches" path))
        (handle-search conn)
      (and (= "GET" method) (util/re-match? #"/searches/[0-9a-z-]+/events" path))
        (handle-events conn)
      :else
        (handle-not-found conn))
   (log {:fn "handle" :at "finish" :conn-id conn-id})))

(def handle
  (let [bp (.. connect middleware (bodyParser))]
    (fn [req res]
      (bp req res (fn [e]
        (handle-core req res e))))))

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
