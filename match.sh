#!/bin/sh
/home/mastermind/csgo-multiserver/csgo-server @$1 create
sed -i 's/${GSLT-""}'/'${GSLT-"'"$2"'"}/g' /root/csgo@$1/msm.d/cfg/server.conf
/home/mastermind/csgo-multiserver/csgo-server @$1 start
