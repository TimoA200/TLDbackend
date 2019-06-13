import os
from bs4 import BeautifulSoup
import config

class Gslt:
    def createGSLT(name):
        command = 'curl -d "appid=730&memo=' + name + '&sessionid=' + config.SESSION_ID + '" +  --header "Host: steamcommunity.com" --header "Connection: keep-alive" --header "Content-Length: 54" --header "Cache-Control: max-age=0" --header "Origin: https://steamcommunity.com" --header "Upgrade-Insecure-Requests: 1" --header "Content-Type: application/x-www-form-urlencoded" --header "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3" --header "Referer: https://steamcommunity.com/dev/managegameservers" --header "Accept-Encoding: gzip, deflate, br" --header "Accept-Language: de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7" --header "Cookie: ' + config.COOKIE + '" -X POST https://steamcommunity.com/dev/creategsaccount -o gslt/' + name + '.html'
        os.system(command)
        command = 'curl https://steamcommunity.com/dev/managegameservers --header "Cookie: ' + config.COOKIE + '" -o gslt/' + name + '.html'
        os.system(command)
        html = open('gslt/' + name + '.html').read()
        return BeautifulSoup(html, 'html.parser').find('td', string='' + name).find_previous_sibling('td').find_previous_sibling("td").decode_contents()

    def deleteGSLT(name):
        html = open('gslt/' + name + '.html').read()
        steamid = BeautifulSoup(html, 'html.parser').find("td", string="" + name).find_next_sibling("td").find("input", {"name":"steamid"})['value']
        command = 'curl -d "steamid=' + steamid + '&sessionid=' + config.SESSION_ID + '" --header "Host: steamcommunity.com" --header "Connection: keep-alive" --header "Content-Length: 60" --header "Cache-Control: max-age=0" --header "Origin: https://steamcommunity.com" --header "Upgrade-Insecure-Requests: 1" --header "Content-Type: application/x-www-form-urlencoded" --header "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3" --header "Referer: https://steamcommunity.com/dev/managegameservers" --header "Accept-Encoding: gzip, deflate, br" --header "Accept-Language: de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7" --header "Cookie: ' + config.COOKIE + '" -X POST https://steamcommunity.com/dev/deletegsaccount -o gslt/' + name + '.html'
        os.system(command)
        command = 'rm gslt/' + name + '.html'
        os.system(command)