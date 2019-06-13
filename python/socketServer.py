from SimpleWebSocketServer import WebSocket

import matchManager

clients = []

class SocketServer(WebSocket):

    def sendToBot(msg):
        print('Send message to bot -> ' + msg)
        for client in clients:
            client.sendMessage(msg)

    def handleConnected(self):
        print(self.address, 'connected')
        for client in clients:
            if client != self:
                client.sendMessage(self.address[0] + u' - connected')
        clients.append(self)

    def handleClose(self):
        clients.remove(self)
        print(self.address, ' closed')
        for client in clients:
            client.sendMessage(self.address[0] + u' - disconnected')


    def handleMessage(self):
        for client in clients:
            if client != self:
                client.sendMessage(self.address[0] + u' - ' + self.data)
        print('message received from: ' + self.address[0] + ' -> ' + self.data)
        self.proccess()


    def proccess(self):
        data = self.data.split(" ")
        print(data)
        if data[0] == 'c':  # name -> data[1] | port -> data[2] | mapid -> data[3] | gamemode -> data[4]
            matchManager.createMatch(data[1], data[2], data[3], data[4])
            #matchManager.MatchManager.createMatch(data[1], data[2], data[3], data[4])
        elif data[0] == 'd':  # name -> data[1] | port -> data[2]
            matchManager.deleteMatch(data[1])
            #matchManager.MatchManager.deleteMatch(data[1])
        elif data[0] == 'da':  # delete all servers
            matchManager.deleteAll()

