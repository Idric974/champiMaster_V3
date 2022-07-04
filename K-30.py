def somme(liste):
    _somme = 0
    for i in liste:
        _somme = _somme + i
    return _somme

def moyenne(liste):
    return somme(liste)/len(liste)

#rpi serial connections
#Python app to run a K-30 Sensor
import serial
import time
import sys

ser = serial.Serial("/dev/ttyUSB0",baudrate =9600,timeout = .5)
ser.flushInput()
time.sleep(1)

limitMesure = int(sys.argv[1])
for i in range(1, 10):
    ser.flushInput()
    ser.write("\xFE\x44\x00\x08\x02\x9F\x25")
    time.sleep(.5)
    resp = ser.read(7)
    high = ord(resp[3])
    low = ord(resp[4])
    co2 = (high*256) + low
    time.sleep(.5)


listCo2 = []
for i in range(1, limitMesure):
    ser.flushInput()
    ser.write("\xFE\x44\x00\x08\x02\x9F\x25")
    time.sleep(.5)
    resp = ser.read(7)
    high = ord(resp[3])
    low = ord(resp[4])
    co2 = (high*256) + low
    listCo2.append(co2 * 12)
    time.sleep(.5)

print (moyenne(listCo2))