(ns leech.conf
  (:require [cljs.nodejs :as node]
            [clojure.string :as str]
            [leech.util :as util]))

(defn env
  "Returns the value of the environment variable k."
  [k]
  (get (js->clj (.env node/process)) k))

(defn env!
  "Returns the value of the environment variable k,
   or raises if k is missing from the environment."
  [k]
  (or (env k) (throw (str "missing key " k))))

(defn aorta-urls [] (str/split (env! "AORTA_URLS") #","))
(defn redis-url [] (env! "REDIS_URL"))
