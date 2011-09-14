(ns leech.server.conf
  (:require [cljs.nodejs :as node]
            [clojure.string :as str]
            [leech.server.util :as util]))

(defn env
  "Returns the value of the environment variable k."
  [k]
  (get (js->clj (.env node/process)) k))

(defn env!
  "Returns the value of the environment variable k,
   or raises if k is missing from the environment."
  [k]
  (or (env k) (throw (str "missing key " k))))

(defn port [] (js/parseInt (env! "PORT")))
(defn aorta-urls [] (str/split (env! "AORTA_URLS") #","))
(defn redis-url [] (env! "REDIS_URL"))
(defn session-secret [] (env! "SESSION_SECRET"))
(defn proxy-url [] (env! "PROXY_URL"))
(defn proxy-secret [] (env! "PROXY_SECRET"))
(defn force-https? [] (boolean (env "FORCE_HTTPS")))
(defn canonical-host [] (env! "CANONICAL_HOST"))
(defn leech-log? [] (boolean (env "LEECH_LOG")))
