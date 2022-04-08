#!/bin/sh
sleep 30
# Install node js
sudo yum update -y
sudo yum install -y gcc-c++ make
sudo yum install --assumeyes curl
curl --silent --location https://rpm.nodesource.com/setup_14.x | sudo bash -
sudo yum install -y nodejs
node -v


sudo yum install -y ruby wget
sleep 10
wget https://aws-codedeploy-us-east-1.s3.us-east-1.amazonaws.com/latest/install
sleep 10
chmod +x ./install
sudo ./install auto
sleep 10
sudo service codedeploy-agent start
sudo service codedeploy-agent status

# Install pm2
npm install
sudo npm install -g pm2


