import os
import threading
import time
from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket

clients = []


class Check(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)

    def run(self):
        while True:
            print("run")
            time.sleep(1)


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
            print('0')
            name = data[1]
            print('1')
            code = data[2]
            print('2')
            port = data[3]
            print('3')
            command = '/home/mastermind/FBShell/FBShell.sh AddPortMapping 0.0.0.0 ' + port + ' TCP 192.168.178.72 1 ' + name + '-tld-tcp 0'
            print('4')
            os.system(command)
            print('5')
            command = '/home/mastermind/FBShell/FBShell.sh AddPortMapping 0.0.0.0 ' + port + ' UDP 192.168.178.72 1 ' + name + '-tld-udp 0'
            print('6')
            os.system(command)
            print('7')
            command = './match.sh ' + name + ' ' + code + ' ' + port
            print('8')
            os.system(command)
            print('9')

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
