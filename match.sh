#!/bin/sh
echo 'hey whats up?'

rpl '${GSLT-""}' '${GSLT-"$2"} /root/csgo@$1/msm.d/cfg/server.conf
'
