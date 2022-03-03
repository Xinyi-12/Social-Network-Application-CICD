#!/bin/sh
sleep 30
# Install node js
sudo yum install -y gcc-c++ make

sudo yum install --assumeyes curl
curl --silent --location https://rpm.nodesource.com/setup_14.x | sudo bash -
sudo yum install -y nodejs

node -v

# Install pm2
sudo npm install -g pm2

# Configure pm2 to run hellonode on startup
# mkdir -p ~/code/app-dist
# mv /root/webservice-1/package.json ~/code/app-dist/package.json
# cd  ~/code/app-dist/
sudo pm2 start ./index.js
sudo pm2 startup systemd
sudo pm2 save
sudo pm2 list


# "mkdir /home#/ubuntu/code",
# mkdir /home/ec2-user
# mv /root/webservice-1/package.json /home/ec2-user/package.json
# sudo yum install -y git
# npm init
# npm install
# npm start
