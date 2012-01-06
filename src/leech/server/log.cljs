(ns leech.server.log
  (:require [cljs.nodejs :as node]
            [clojure.string :as string]
            [leech.server.conf :as conf]
            [leech.server.util :as util]))

(defn- re-match? [re s]
  (boolean (.exec re s)))

(defn- unparse1 [[k v :as arg]]
  (str (name k) "="
    (cond
      (or (true? v) (false? v))
        v
      (keyword? v)
        (name v)
      (number? v)
        v
      (string? v)
        (cond
          (re-match? #"^[a-zA-Z0-9\:\.\-\_]+$" v)
            v
          (neg? (.indexOf v "\""))
            (str "\"" v "\"")
          :else
            (str "'" v "'"))
      :else
        "?")))

(defn- unparse [data]
  (->> data
    (map unparse1)
    (string/join " ")))

(defn write [data]
  (println (unparse data)))

(defn log
  [data]
  (println (unparse (merge {:app "leech" :deploy (conf/deploy)} data))))

(defn start []
  (log {:fn "start" :at "start"}))

(util/main "log" start)
