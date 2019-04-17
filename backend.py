import os
import threading
import time
from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket
from bs4 import BeautifulSoup

clients = []
matches = []


def creategslt():
    print('try to create gslt for server with id -> test')
    command = 'curl -d "appid=730&memo=' + 'test' + '&sessionid=7f6485556d7104ef41146653" --header "Cookie: sessionid=7f6485556d7104ef41146653; steamCountry=DE%7C1014e5d9cdff2826218d409fb1eb5a56; timezoneOffset=7200,0; _ga=GA1.2.275275590.1555411498; steamLoginSecure=76561198832942031%7C%7CD71E1EE78B42609277E0314337FD4546AD467576; steamMachineAuth76561198832942031=00FA6438D4EFD3645FA96E4E8EBE9701B85EF355; browserid=1089217996877788449; recentlyVisitedAppHubs=730%2C225600%2C327070; app_impressions=730@2_9_100006_100202|730@2_9_100006_100202|225600@2_9_100006_100202|730@2_9_100006_100202|327070@2_9_100006_100202" -X POST https://steamcommunity.com/dev/creategsaccount -o gslt/test.html'
    os.system(command)
    command = 'curl https://steamcommunity.com/dev/managegameservers --header "Cookie: sessionid=7f6485556d7104ef41146653; steamCountry=DE%7C1014e5d9cdff2826218d409fb1eb5a56; timezoneOffset=7200,0; _ga=GA1.2.275275590.1555411498; steamLoginSecure=76561198832942031%7C%7CD71E1EE78B42609277E0314337FD4546AD467576; steamMachineAuth76561198832942031=00FA6438D4EFD3645FA96E4E8EBE9701B85EF355; browserid=1089217996877788449; recentlyVisitedAppHubs=730%2C225600%2C327070; app_impressions=730@2_9_100006_100202|730@2_9_100006_100202|225600@2_9_100006_100202|730@2_9_100006_100202|327070@2_9_100006_100202" -o gslt/test.html'
    os.system(command)
    html = open("gslt/test.html").read()
    soup = BeautifulSoup(html, 'html.parser')
    gslt = soup.find("td", string="test").find_previous_sibling("td").find_previous_sibling("td").decode_contents()
    print('gslt -> ' + gslt)
    print('successfully created gslt for server with id -> test')


def deletegslt():
    print('try to delete gslt for server with id -> test')
    html = open("gslt/test.html").read()
    soup = BeautifulSoup(html, 'html.parser')
    steamid = soup.find("td", string="test").find_next_sibling("td").find("input", {"name":"steamid"})['value']
    command = 'curl -d "steamid=85568392922903941&sessionid=7f6485556d7104ef41146653" --header "Cookie: sessionid=7f6485556d7104ef41146653; steamCountry=DE%7C1014e5d9cdff2826218d409fb1eb5a56; timezoneOffset=7200,0; _ga=GA1.2.275275590.1555411498; steamLoginSecure=76561198832942031%7C%7CD71E1EE78B42609277E0314337FD4546AD467576; steamMachineAuth76561198832942031=00FA6438D4EFD3645FA96E4E8EBE9701B85EF355; browserid=1089217996877788449; recentlyVisitedAppHubs=730%2C225600%2C327070; app_impressions=730@2_9_100006_100202|730@2_9_100006_100202|225600@2_9_100006_100202|730@2_9_100006_100202|327070@2_9_100006_100202" -X POST https://steamcommunity.com/dev/deletegsaccount -o gslt/test.html'
    os.system(command)
    command = 'rm gslt/test.html'
    os.system(command)
    print('successfully deleted gslt for server with id -> test')


creategslt()
deletegslt()


class Check(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)

    def run(self):
        while True:
            print('check if there are any servers to delete')
            for match in matches:
                try:
                    fh = open('/root/csgo@' + match.name + '/csgo/addons/sourcemod/delete.txt', 'r')
                    print('server with id -> ' + match.name + ' is ready to delete')
                    match.canDelete = True
                    matches.remove(match)
                except FileNotFoundError:
                    pass
            time.sleep(10)


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
        while True:
            if self.canDelete:
                self.delete()
                break

    def creategslt(self):
        print('try to create gslt for server with id -> ' + self.name)
        command = 'curl -d "appid=730&memo=' + self.name + '&sessionid=7f6485556d7104ef41146653" --header "Host: steamcommunity.com" --header "Connection: keep-alive" --header "Cache-Control: max-age=0" --header "Origin: https://steamcommunity.com" --header "Upgrade-Insecure-Requests: 1" --header "Content-Type: application/x-www-form-urlencoded" --header "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3" --header "Referer: https://steamcommunity.com/dev/managegameservers" --header "Accept-Encoding: gzip, deflate, br" --header "Accept-Language: de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7" --header "Cookie: sessionid=7f6485556d7104ef41146653; steamCountry=DE%7C1014e5d9cdff2826218d409fb1eb5a56; timezoneOffset=7200,0; _ga=GA1.2.275275590.1555411498; steamLoginSecure=76561198832942031%7C%7CD71E1EE78B42609277E0314337FD4546AD467576; steamMachineAuth76561198832942031=00FA6438D4EFD3645FA96E4E8EBE9701B85EF355; browserid=1089217996877788449; recentlyVisitedAppHubs=730%2C225600%2C327070; app_impressions=730@2_9_100006_100202|730@2_9_100006_100202|225600@2_9_100006_100202|730@2_9_100006_100202|327070@2_9_100006_100202" -X POST https://steamcommunity.com/dev/creategsaccount -o test.html'
        os.system(command)

    def deletegslt(self):
        pass

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
        command = '/home/mastermind/csgo-multiserver/csgo-server @' + self.name + ' start'
        os.system(command)
        print('successfully created and started server on port -> ' + self.port)

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
        if data[0] == 'c':  # name -> data[1] | code -> data[2] | port -> data[3] | mapid -> data[4]
            match = Match(data[1], data[2], data[3], data[4])
            match.start()
            matches.append(match)

        elif data[0] == 'd':  # name -> data[1] | port -> data[2]
            for match in matches:
                if match.getName() == data[1]:
                    match.canDelete = True
                    matches.remove(match)

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


check = Check()
check.start()

backend = SimpleWebSocketServer('', 11111, Backend)
backend.serveforever()
