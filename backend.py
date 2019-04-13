import os
import threading
from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket

clients = []


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
            command = './match.sh ' + name + ' ' + code
            #os.system(command)

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

    print('after')


backend = SimpleWebSocketServer('', 11111, Backend)
backend.serveforever()


def hmmm():
    print('hmmm')
