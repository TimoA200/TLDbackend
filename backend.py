from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket

clients = []


class Backend(WebSocket):

    def handleMessage(self):
        for client in clients:
            if client != self:
                client.sendMessage(self.address[0] + u' - ' + self.data)
                print('got')
        print('got1')

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


def process(self):
    print('process: ' + self.data)
