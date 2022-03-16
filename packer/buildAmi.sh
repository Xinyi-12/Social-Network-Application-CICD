#!/bin/sh
sleep 30
# Install node js
sudo yum install -y gcc-c++ make
sudo yum install --assumeyes curl
curl --silent --location https://rpm.nodesource.com/setup_14.x | sudo bash -
sudo yum install -y nodejs
node -v

# Install pm2
sudo yum update -y
npm install
sudo npm install -g pm2
cd /home/ec2-user
sudo pm2 start ./index.js
sudo pm2 startup systemd
sudo pm2 save
sudo pm2 list

