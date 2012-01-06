(ns leech.server.web
  (:require [cljs.nodejs :as node]
            [cljs.reader :as reader]
            [clojure.string :as string]
            [leech.server.conf :as conf]
            [leech.server.log :as log]
            [leech.server.util :as util]))

(def url (node/require "url"))
(def fs (node/require "fs"))
(def node-uuid (node/require "node-uuid"))
(def redis (node/require "redis-url"))
(def http (node/require "http"))
(def connect (node/require "connect"))

(defn log [data]
  (log/log (merge {:ns "web"} data)))

(def redis-client (atom nil))

(defn write-res [{:keys [res]} status headers body]
  (.writeHead res status (util/clj->js headers))
  (.write res body)
  (. res (end)))

(defn handle-redirect [conn loc]
  (write-res conn 302 {"Location" loc} "You are being redirected."))

(defn handle-not-found [{:keys [request-id] :as conn}]
  (log {:fn "handle-not-found" :at "start" :request-id request-id})
  (write-res conn 404 {"Content-Type" "application/clj"} (pr-str {"error" "not found"})))

(defn handle-not-authorized [{:keys [request-id] :as conn}]
  (log {:fn "handle-not-authorized" :at "start" :request-id request-id})
  (write-res conn 403 {"Content-Type" "application/clj"} (pr-str {"error" "not authorized"})))

(defn handle-static [{:keys [request-id] :as conn} asset]
  (log {:fn "handle-static" :at "start" :request-id request-id :asset asset})
  (.readFile fs (str "./public/" asset) (fn [e c]
    (log {:fn "handle-static" :at "read"})
      (write-res conn 200 {"Content-Type" "text/html"} c))))

(defn handle-search [{:keys [request-id req res query-params] :as conn}]
  (log {:fn "handle-search" :at "start" :request-id request-id})
  (let [{:strs [search-id query]} query-params
        events-key (str "searches." search-id ".events")
        search-data {:search-id search-id :query query :events-key events-key :target :list}
        search-str (pr-str search-data)]
    (.. (deref redis-client)
      (multi)
      (zadd "searches" (util/millis) search-str)
      (lrange events-key 0 100000)
      (ltrim events-key 100000 -1)
      (exec (fn [err res-js]
        (let [res (js->clj res-js)]
          (log {:fn "handle-search" :at "execed" :request-id request-id :search-id search-id})
          (let [events (map reader/read-string (second res))]
            (write-res conn 200 {"Content-Type" "application/json"} (util/json-generate events)))))))))

(defn handle-core [{:keys [request-id method path] :as conn}]
  (log {:fn "handle-core" :at "start" :request-id request-id :method method :path path})
  (cond
    (and (= "GET" method) (= "/" path))
      (handle-static conn "index.html")
    (and (= "GET" method) (= "/leech.css" path))
      (handle-static conn "leech.css")
    (and (= "GET" method) (= "/leech.js" path))
      (handle-static conn "leech.js")
    (and (= "GET" method) (= "/jquery.form.js" path))
      (handle-static conn "jquery.form.js")
    (and (= "GET" method) (= "/search" path))
      (handle-search conn)
    :else
      (handle-not-found conn)))

(defn handle-openid [{:keys [request-id method path query-params req] :as conn}]
  (let [sess (.session req)]
    (log {:fn "handle-openid" :at "start" :request-id request-id})
    (cond
      (= ["GET" "/auth"] [method path])
        (if (= (conf/proxy-secret) (get query-params "proxy_secret"))
          (do
            (set! (.authorized sess) true)
            (handle-redirect conn "/"))
          (handle-not-authorized conn))
      (not (.authorized sess))
        (let [callback-url (str (conf/canonical-host) "/auth")]
          (handle-redirect conn (str (conf/proxy-url) "?" "callback_url=" (js/encodeURI callback-url))))
      :authorized
        (handle-core conn))))

(defn handle-https [{:keys [request-id headers] :as conn}]
  (if (and (conf/force-https?) (not= (get headers "x-forwarded-proto") "https"))
    (handle-redirect conn (conf/canonical-host))
    (handle-openid conn)))

(defn handle-favicon [{:keys [request-id method path] :as conn}]
  (if (= ["GET" "/favicon.ico"] [method path])
    (handle-not-found conn)
    (handle-https conn)))

(defn parse-req [req]
  (let [url-parsed (.parse url (.url req) true)]
    {:method (.method req)
     :path (.pathname url-parsed)
     :query-params (js->clj (.query url-parsed))
     :headers (js->clj (.headers req))}))

(def handle
  (let [cp (.. connect (cookieParser))
        s  (.. connect (session (util/clj->js {:secret (conf/session-secret)})))]
    (fn [req res]
      (cp req res (fn [_]
        (s req res (fn [_]
          (let [request-id (node-uuid)
               {:keys [method path query-params headers]} (parse-req req)
                conn {:request-id request-id :req req :res res :method method :path path :query-params query-params :headers headers}]
            (log {:fn "handle" :at "start" :request-id request-id :method method :path path})
            (handle-favicon conn)))))))))

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
  (log {:fn "start" :at "start"})
  (let [rc (.createClient redis (conf/redis-url))
        port (conf/port)]
    (swap! redis-client (constantly rc))
    (log {:fn "start" :at "listen" :port port})
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
