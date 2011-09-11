(ns leech.parse
  (:require [cljs.nodejs :as node]
            [clojure.string :as str]
            [leech.util :as util]))

(def isodate (node/require "isodate"))

(defn re-match? [re s]
  (.test re s))

(def long-re
  #"^-?[0-9]{1,18}$")

(def double-re
  #"^-?[0-9]+\.[0-9]+$")

(defn parse-long [s]
  (if s (js/parseInt s)))

(defn parse-double [s]
  (if s (js/parseFloat s)))

(defn coerce-val [v]
  (cond
    (re-match? long-re v)
      (parse-long v)
    (re-match? double-re v)
      (parse-double v)
    (= "" v)
      nil
    :else
      v))

(def attrs-re
  #"( *)([a-zA-Z0-9_]+)(=?)([a-zA-Z0-9\.:/_-]*)")

(defn parse-message-attrs [msg]
  (let [raw-attrs (js-obj)]
    (loop [unparsed-msg msg]
      (if-let [matches (.exec attrs-re unparsed-msg)]
        (let [match (aget matches 0)
              space (aget matches 1)
              key   (aget matches 2)
              eq    (aget matches 3)
              val   (aget matches 4)]
          (aset raw-attrs key (if (= "" eq) true (coerce-val val)))
          (recur (.substring unparsed-msg (.length match) (.length unparsed-msg))))))
    (ObjMap. nil (js-keys raw-attrs) raw-attrs)))

(defn parse-timestamp [s]
  (let [d (isodate s)]
    (. d (getTime))))

(def standard-re
  #"^(\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d[\-\+]\d\d:00) ([0-9\.]+) ([a-z0-7]+)\.([a-z]+) ([a-z\-\_]+)(\[(\d+)\])? - ([a-z4-6-]+)?\.(\d+)@([a-z.]+\.com) - (.*)$")

(defn parse-standard-line [l]
  (if-let [m (re-matches standard-re l)]
    (merge
      {"event_type" "standard"
       "timestamp_src" (parse-timestamp (get m 1))
       "host" (get m 2)
       "facility" (get m 3)
       "level" (get m 4)
       "component" (get m 5)
       "pid" (parse-long (get m 7))
       "slot" (get m 8)
       "ion_id" (parse-long (get m 9))
       "cloud" (get m 10)}
      (parse-message-attrs (get m 11)))))

(def raw-re
  #"^(\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d[\-\+]\d\d:00) ([0-9\.]+) ([a-z0-7]+)\.([a-z]+) (.*)$")

(defn parse-raw-line [l]
  (if-let [m (re-matches raw-re l)]
    {"event_type" "raw"
     "timestamp_src" (parse-timestamp (get m 1))
     "host" (get m 2)
     "facility" (get m 3)
     "level" (get m 4)
     "message" (get m 5)}))

(def nginx-access-re
     ;timestamp_src                              ;host      ;facility    ;level           ;slot        ;ion_id ;cloud           ;http_host                                                              ;http_method,_url,_version      ;http_status,_bytes,_referrer,_user_agent,_domain
  #"^(\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d-\d\d:00) ([0-9\.]+) ([a-z0-7]+)\.([a-z]+) nginx - ([a-z4-6-]+)?\.(\d+)@([a-z.]+\.com) - ([0-9\.]+) - - \[\d\d/[a-zA-z]{3}/\d\d\d\d:\d\d:\d\d:\d\d -\d\d00\] \"([a-zA-Z]+) (\S+) HTTP/(...)\" (\d+) (\d+) \"([^\"]+)\" \"([^\"]+)\" (\S+)$")

(defn parse-nginx-access-line [l]
  (if-let [m (re-matches nginx-access-re l)]
    {"event_type" "nginx_access"
     "timestamp_src" (parse-timestamp (get m 1))
     "host" (get m 2)
     "facility" (get m 3)
     "level" (get m 4)
     "component" "nginx"
     "slot" (get m 5)
     "ion_id" (parse-long (get m 6))
     "cloud" (get m 7)
     "http_host" (get m 8)
     "http_method" (get m 9)
     "http_url" (get m 10)
     "http_version" (get m 11)
     "http_status" (parse-long (get m 12))
     "http_bytes" (parse-long (get m 13))
     "http_referrer" (get m 14)
     "http_user_agent" (get m 15)
     "http_domain" (get m 16)}))

(def nginx-error-re
  #"^(\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d-\d\d:00) ([0-9\.]+) ([a-z0-7]+)\.([a-z]+) nginx - ([a-z4-6]+)?\.(\d+)@([a-z.]+\.com) - .* \[error\] (.*)$")

(defn parse-nginx-error-line [l]
  (if-let [m (re-matches nginx-error-re l)]
    {"event_type" "nginx_error"
     "timestamp_src" (parse-timestamp (get m 1))
     "host" (get m 2)
     "facility" (get m 3)
     "level" (get m 4)
     "component" "nginx"
     "slot" (get m 5)
     "ion_id" (parse-long (get m 6))
     "cloud" (get m 7)
     "message" (get m 8)}))

(def varnish-access-re
  #"^(\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d[\-+]\d\d:00) ([0-9\.]+) ([a-z0-7]+)\.([a-z]+) varnish\[(\d+)\] - ([a-z4-6\-]+)?\.(\d+)@([a-z.]+\.com) - [0-9\.]+ - - .*\" (\d\d\d) .*$")

(defn parse-varnish-access-line [l]
  (if-let [m (re-matches varnish-access-re l)]
    {"event_type" "varnish_access"
     "timestamp_src" (parse-timestamp (get m 1))
     "host" (get m 2)
     "facility" (get m 3)
     "level" (get m 4)
     "component" "varnish"
     "pid" (parse-long (get m 5))
     "slot" (get m 6)
     "ion_id" (parse-long (get m 7))
     "cloud" (get m 8)
     "http_status" (parse-long (get m 9))}))

(defn log [data]
  (util/log (merge {:ns "parse"} data)))

(defn parse-line [l]
  (try*
    (or (parse-nginx-access-line l)
        (parse-nginx-error-line l)
        (parse-varnish-access-line l)
        (parse-standard-line l)
        (parse-raw-line l))
    (catch e
      (log {:fn "parse-line" :event "error" :line l :name (.name e) :message (.message e)})
      (throw e))))
