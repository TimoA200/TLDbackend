import os, threading, time
from SimpleWebSocketServer import SimpleWebSocketServer

import socketServer, config, match, matchManager

check = matchManager.Check()
check.start()

socket = SimpleWebSocketServer('', 11111, socketServer.SocketServer)
socket.serveforever()
