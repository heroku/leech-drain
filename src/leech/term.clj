(ns leech.term
  (:require [leech.conf :as conf])
  (:require [leech.util :as util])
  (:require [leech.queue :as queue])
  (:require [leech.io :as io]))

(def color-codes
  {:red     "\033[31m"
   :green   "\033[32m"
   :yellow  "\033[33m"
   :blue    "\033[34m"
   :magenta "\033[35m"
   :cyan    "\033[36m"
   :default "\033[39m"})

(def component-colors
  {"runtime"   :magenta
   "psmgr"     :magenta
   "codex"     :yellow
   "gitproxy"  :yellow
   "core"      :green
   "memcache"  :green
   "balrog"    :green
   "hermes"    :blue
   "varnish"   :blue
   "nginx"     :blue
   "face"      :blue
   "logplex"   :blue
   "shen"      :red
   "pgmonitor" :red
   "su"        :cyan
   "syslog-ng" :cyan
   "syslog"    :cyan
   "slapd"     :cyan
   "kernel"    :cyan
   "heroku"    :cyan})

(defn- colored
  [color text]
  (str (color-codes color) text (color-codes :default)))

(defn init-writer [write-queue]
  (util/spawn-loop (fn []
    (let [{:strs [line component]} (queue/take write-queue)
          color (get component-colors component)]
      (println (colored color line))))))

(defn -main []
  (let [write-queue (queue/init 1000)]
    (init-writer write-queue)
    (io/init-subscriber (conf/redis-url) "event.received" write-queue)))
