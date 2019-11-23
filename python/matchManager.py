import threading, time

from match import Match

matches = []


def createMatch(name, port, mapid, gamemode):
    match = Match(name, port, mapid, gamemode)
    match.start()
    matches.append(match)


def deleteMatch(name):
    for match in matches:
        if match.getName() == name:
            match.canDelete = True
            matches.remove(match)


def deleteAll():
    for match in matches:
        match.canDelete = True
        matches.remove(match)


class Check(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)

    def run(self):
        while True:
            for match in matches:
                try:
                    fh = open('/root/csgo@' + match.name + '/csgo/addons/sourcemod/delete.txt', 'r')
                    print('server with id -> ' + match.name + ' is ready to delete')
                    match.canDelete = True
                    matches.remove(match)
                except FileNotFoundError:
                    pass
            time.sleep(10)


