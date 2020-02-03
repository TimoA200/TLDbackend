import os, threading, time

from utils.gslt import Gslt
import config, socketServer

class Match(threading.Thread):
    def __init__(self, name, port, mapid, gamemode):
        threading.Thread.__init__(self)
        self.name = name
        self.port = port
        self.mapid = mapid
        self.gamemode = gamemode
        self.canDelete = False

    def run(self):
        self.create()
        while True:
            if self.canDelete:
                self.delete()
                break
            time.sleep(1)

    def create(self):
        print('Try to create and start server with id -> ' + self.name)
        print('Try to create gslt for server with id -> ' + self.name)
        try: self.gslt = Gslt.createGSLT(self.name)
        except: print('Something went wrong while creating the gslt for server with id -> ' + self.name)
        else: print('Successfully created gslt -> ' + self.gslt + ' for server with id -> ' + self.name)
        command = 'csgo-server @' + self.name + ' create'
        os.system(command)
        with open('/root/csgo@' + self.name + '/msm.d/cfg/server.conf', 'r') as f:
            s = f.read()
        with open('/root/csgo@' + self.name + '/msm.d/cfg/server.conf', 'w') as f:
            s = s.replace('${GSLT-""}', '${GSLT-"' + self.gslt + '"}')
            s = s.replace('${PORT-"27015"}', '${PORT-"' + self.port + '"}')
            s = s.replace('${TICKRATE-"128"}', '${TICKRATE-"' + str(config.TICKRATE) + '"}')
            s = s.replace('TITLE="CS:GO server @$INSTANCE (powered by csgo-multiserver)"',
                              'TITLE="CS:GO server @$INSTANCE (powered by TLD https://tld.hopto.org)"')
            s = s.replace('+mapgroup $MAPGROUP', '-authkey A81E42AF2DDFDC28A9B13CE43901F112')
            if self.gamemode == 'competitive':
                game_type = 0
                game_mode = 1
            elif self.gamemode == 'casual':
                game_type = 0
                game_mode = 0
            elif self.gamemode == 'wingman':
                game_type = 0
                game_mode = 2
            elif self.gamemode == 'deathmatch':
                game_type = 1
                game_mode = 2
            elif self.gamemode == 'demolition':
                game_type = 1
                game_mode = 1
            elif self.gamemode == 'armsrace':
                game_type = 1
                game_mode = 0
            elif self.gamemode == 'guardian':
                game_type = 4
                game_mode = 0
            elif self.gamemode == 'coop':
                game_type = 4
                game_mode = 1
            elif self.gamemode == 'dangerzone':
                game_type = 6
                game_mode = 0
            elif self.gamemode == 'custom':
                game_type = 3
                game_mode = 0
            else:
                print('Wrong argument in gamemode using default values for casual.')
                game_type = 0
                game_mode = 0

            s = s.replace('${GAMETYPE-"0"}', '${GAMETYPE-"' + str(game_type) + '"}')
            s = s.replace('${GAMEMODE-"1"}', '${GAMEMODE-"' + str(game_mode) + '"}')
            s = s.replace('+map $MAP', '+host_workshop_map ' + self.mapid)
            f.write(s)
        command = 'csgo-server @' + self.name + ' start'
        os.system(command)
        print('Successfully created and startet server on port -> ' + self.port)
        socketServer.SocketServer.sendToBot(self.name + ' r')

    def delete(self):
        print('Try to stop and delete server with id -> ' + self.name)
        print('Try to delete gslt -> ' + self.gslt + ' for server with id -> ' + self.name)
        try: Gslt.deleteGSLT(self.name)
        except: print('Something went wrong while deleting the gslt for server with id -> ' + self.name)
        else: print('Successfully deleted gslt -> ' + self.gslt + ' for server with id -> ' + self.name)
        command = 'csgo-server @' + self.name + ' stop'
        os.system(command)
        command = 'rm -r /root/csgo@' + self.name
        os.system(command)
        print('Successfully stopped and deleted server with id -> ' + self.name)
        socketServer.SocketServer.sendToBot(self.name + ' d')

