#!/bin/sh
echo 'hey whats up?'

/home/mastermind/csgo-multiserver/csgo-server @$1 create
rpl '${GSLT-""}' '${GSLT-"$2"} /root/csgo@$1/msm.d/cfg/server.conf
