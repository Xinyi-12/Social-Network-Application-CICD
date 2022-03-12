#!/bin/sh
sleep 20
# Install node js
sudo yum install -y gcc-c++ make
sudo yum install --assumeyes curl
curl --silent --location https://rpm.nodesource.com/setup_14.x | sudo bash -
sudo yum install -y nodejs
node -v

# Install pm2
sudo npm install -g pm2
