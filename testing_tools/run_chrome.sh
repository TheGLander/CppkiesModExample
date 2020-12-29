#!/bin/bash
CWD=$(pwd)
google-chrome cookieclicker.eu/cookieclicker/ --remote-debugging-port=9222 --load-extension="$CWD\testing_tools\SimpleCookieClickerInjector" &