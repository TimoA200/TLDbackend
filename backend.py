import os
import threading
import time
from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket

clients = []


class Check(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)

    def run(self):
        pass


check = Check()
check.start()


class Backend(WebSocket):

    def handleMessage(self):
        for client in clients:
            client.sendMessage(self.address[0] + u' - ' + self.data)
        print('message received from: ' + self.address[0] + " -> " + self.data)
        data = self.data.split(" ")
        print(data)
        if data[0] == 'c':
            name = data[1]
            code = data[2]
            port = data[3]
            map = data[4]
            print('name: ' + name)
            print('code: ' + code)
            print('port: ' + port)
            command = '/home/mastermind/FBShell/FBShell.sh AddPortMapping 0.0.0.0 ' + port + ' TCP ' + port + ' 192.168.178.72 1 ' + name + '-tld-tcp 0'
            print(command)
            os.system(command)
            command = '/home/mastermind/FBShell/FBShell.sh AddPortMapping 0.0.0.0 ' + port + ' UDP ' + port + ' 192.168.178.72 1 ' + name + '-tld-udp 0'
            print(command)
            os.system(command)
            command = '/home/mastermind/csgo-multiserver/csgo-server @' + name + ' create'
            os.system(command)
            with open('/root/csgo@' + name + '/msm.d/cfg/server.conf', 'r') as f:
                s = f.read()
            with open('/root/csgo@' + name + '/msm.d/cfg/server.conf', 'w') as f:
                s = s.replace('${GSLT-""}', '${GSLT-"' + code + '"}')
                s = s.replace('${PORT-"27015"}', '${PORT-"' + port + '"}')
                s = s.replace('+mapgroup $MAPGROUP', '-authkey A81E42AF2DDFDC28A9B13CE43901F112')
                s = s.replace('+map $MAP', '+host_workshop_map ' + map)
                f.write(s)
            command = '/home/mastermind/csgo-multiserver/csgo-server @' + name + ' start'
            os.system(command)
        elif data[0] == 'd':
            name = data[1]
            port = data[2]
            command = '/home/mastermind/csgo-multiserver/csgo-server @' + name + ' stop'
            os.system(command)
            command = 'rm -r /root/csgo@' + name
            os.system(command)
            command = '/home/mastermind/FBShell/FBShell.sh DeletePortMapping 0.0.0.0 ' + port + ' TCP'
            os.system(command)
            command = '/home/mastermind/FBShell/FBShell.sh DeletePortMapping 0.0.0.0 ' + port + ' UDP'
            os.system(command)

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

print('Stopping backend')
