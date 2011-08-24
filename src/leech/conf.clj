(ns leech.conf
  (:require [leech.util :as util])
  (:require [clojure.string :as str]))

(defn env [k]
  (System/getenv k))

(defn env! [k]
  (or (env k) (throw (Exception. (str "missing key " k)))))

(defn aorta-urls [] (str/split (env! "AORTA_URLS") #","))
(defn cloud [] (env! "CLOUD"))
