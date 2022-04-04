#!/bin/sh
sudo pm2 start ./index.js
sudo pm2 startup systemd