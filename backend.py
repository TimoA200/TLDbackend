import os
import threading
import time
from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket

clients = []
matches = []


class Match(threading.Thread):
    def __init__(self, name, code, port, mapid):
        threading.Thread.__init__(self)
        self.name = name
        self.code = code
        self.port = port
        self.mapid = mapid
        self.canDelete = False

    def run(self):
        self.create()
        i = 0
        while not self.canDelete:
            i = i + 1
            print('i -> ' + str(i))
            if i == 5:
                self.canDelete = True
            if self.canDelete:
                self.delete()
                break
            time.sleep(5)

    def create(self):
        print('try to create and start the server')
        command = '/home/mastermind/csgo-multiserver/csgo-server @' + self.name + ' create'
        os.system(command)
        with open('/root/csgo@' + self.name + '/msm.d/cfg/server.conf', 'r') as f:
            s = f.read()
        with open('/root/csgo@' + self.name + '/msm.d/cfg/server.conf', 'w') as f:
            s = s.replace('${GSLT-""}', '${GSLT-"' + self.code + '"}')
            s = s.replace('${PORT-"27015"}', '${PORT-"' + self.port + '"}')
            s = s.replace('+mapgroup $MAPGROUP', '-authkey A81E42AF2DDFDC28A9B13CE43901F112')
            s = s.replace('+map $MAP', '+host_workshop_map ' + self.mapid)
            f.write(s)
        command = '/home/mastermind/csgo-mutliserver/csgo-server @' + self.name + ' start'
        os.system(command)
        print('successfully created and started server')

    def delete(self):
        print('try to stop and delete the server')
        command = '/home/mastermind/csgo-multiserver/csgo-server @' + self.name + ' stop'
        os.system(command)
        command = 'rm -r /root/csgo@' + self.name
        os.system(command)
        print('successfully stopped and deleted server')


class Backend(WebSocket):
    def handleMessage(self):
        for client in clients:
            client.sendMessage(self.address[0] + u' - ' + self.data)
        print('message received from: ' + self.address[0] + " -> " + self.data)
        data = self.data.split(" ")
        print(data)
        if data[0] == 'c':
            match = Match(data[1], data[2], data[3], data[4])
            match.start()
            matches.append(match)

        elif data[0] == 'd':
            name = data[1]
            port = data[2]

    def handleConnected(self):
        print(self.address, 'connected')
        for client in clients:
            client.sendMessage(self.address[0] + u' - connected')
        clients.append(self)

    def handleClose(self):
        clients.remove(self)
        print(self.address, 'closed')
        for client in clients:
            client.sendMessage(self.address[0] + u' - disconnected')


backend = SimpleWebSocketServer('', 11111, Backend)
backend.serveforever()
