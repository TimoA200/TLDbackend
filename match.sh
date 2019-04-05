#!/bin/sh
echo 'hey whats up?'

/home/mastermind/csgo-multiserver/csgo-server @$1 create
sed -i 's/${GSLT-""}'/'${GSLT-"$2"}/g' /root/csgo@$1/msm.d/cfg/server.conf
echo 'wow'
