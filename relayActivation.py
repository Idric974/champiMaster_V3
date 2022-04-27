import RPi.GPIO as GPIO
import time
import sys

GPIO.setmode(GPIO.BOARD)

print(int(sys.argv[1]))

GPIO.setup(int(sys.argv[1]), GPIO.OUT)
GPIO.output(int(sys.argv[1]), GPIO.LOW)
# allumer

time.sleep(int(sys.argv[2]))

GPIO.output(int(sys.argv[1]), GPIO.LOW)
# eteint

GPIO.cleanup()