(ns leech.server.util
  (:require [cljs.nodejs :as node]
            [clojure.string :as string]
            [leech.server.conf :as conf]))

(def url (node/require "url"))

(defn log
  "Log the given data."
  [data]
  (prn (merge {:app "leech" :deploy (conf/deploy)} data)))

(defn millis
  "Returns milliseconds since the epoch."
  []
  (. (js/Date.) (getTime)))

(defn update
  "Update-in for n=1."
  [m k f]
  (assoc m k (f (get m k))))

(defn re-match?
  "Returns true if the given s matches the given re."
  [re s]
  (.test re s))

(declare clj->js)

(defn clj->js
  "Recursively transforms ClojureScript maps into Javascript objects,
   other ClojureScript colls into JavaScript arrays, and ClojureScript
   keywords into JavaScript strings."
  [x]
  (cond
    (string? x) x
    (keyword? x) (name x)
    (map? x) (.strobj (reduce (fn [m [k v]] (assoc m (clj->js k) (clj->js v))) {} x))
    (coll? x) (apply array (map clj->js x))
    :else x))

(defn json-generate
  "Returns a newline-terminate JSON string from the given ClojureScript data."
  [data]
  (str (JSON/stringify (clj->js data)) "\n"))

(defn json-parse
  "Returns ClojureScript data for the given JSON string."
  [line]
  (js->clj (JSON/parse line)))

(defn url-parse
  "Returns a map with parsed data for the given URL."
  [u]
  (let [raw (js->clj (.parse url u))]
    {:protocol (.substr (get raw "protocol") 0 (dec (.length (get raw "protocol"))))
     :host (get raw "hostname")
     :port (js/parseInt (get raw "port"))
     :path (get raw "pathname")
     :auth (get raw "auth")}))

(defn set-timeout
  "Invoke the given function after delay milliseconds."
  [delay f]
  (js/setTimeout f delay))

(defn clear-timeout
  "Cancle the delayed invocation specified by the given timeout id."
  [timeout-id]
  (js/cancelTimeout delay))

(defn set-interval
  "Invoke the given function after delay and then every interval milliseconds."
  [delay interval f]
  (let [interval-id-a (atom nil)
        timeout-id (set-timeout delay (fn []
                     (f)
                     (let [interval-id (js/setInterval f interval)]
                       (swap! interval-id-a (constantly interval-id)))))]
    [timeout-id interval-id-a]))

(defn clear-interval
  "Cancel the periodic invocation specified by the given interval id."
  [[timeout-id interval-id-a]]
  (js/clearTimeout timeout-id)
  (if-let [interval-id (deref interval-id-a)]
    (js/clearInterval interval-id)))

(defn next-tick
  "Call the given function on the next tick."
  [f]
  (.nextTick node/process f))

(defn trap
  "Trap the Unix signal sig with the given function."
  [sig f]
  (.on node/process (str "SIG" sig) f))

(defn exit
  "Exit with the given status."
  [status]
  (.exit node/process status))

(defn argv
  "Returns the argv as a vector."
  []
  (vec (js->clj (.argv node/process))))

(defn main
  "Set the top-level entry point to the given function."
  [main-name f]
  (let [cl-name (or (get (js->clj (.argv node/process)) 2)
                    (throw "no main name given"))]
  (if (= cl-name main-name)
    (set! *main-cli-fn* (fn [& _] (f))))))
