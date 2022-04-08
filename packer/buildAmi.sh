#!/bin/sh
sleep 30
# Install node js
sudo yum install -y gcc-c++ make
sudo yum install --assumeyes curl
curl --silent --location https://rpm.nodesource.com/setup_14.x | sudo bash -
sudo yum install -y nodejs
node -v
sudo yum install ruby
sudo yum install wget
CODEDEPLOY_BIN="/opt/codedeploy-agent/bin/codedeploy-agent"
sudo yum erase codedeploy-agent -y
sudo cd /home/ec2-user
wget https://aws-codedeploy-us-east-1.s3.us-east-1.amazonaws.com/latest/install
sudo chmod +x ./install
sudo ./install auto
sudo service codedeploy-agent status
sudo service codedeploy-agent start
sudo service codedeploy-agent status

# Install pm2
sudo yum update -y
npm install
sudo npm install -g pm2
