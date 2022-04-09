#!/bin/sh
sleep 30
# Install node js
sudo yum update -y
sudo yum install -y gcc-c++ make
sudo yum install --assumeyes curl
curl --silent --location https://rpm.nodesource.com/setup_14.x | sudo bash -
sudo yum install -y nodejs
node -v

# sudo ./install auto -v releases/codedeploy-agent-1.0.1.854.rpm
sudo yum install -y ruby wget
sleep 10
wget https://aws-codedeploy-us-east-1.s3.us-east-1.amazonaws.com/latest/install
sleep 10
chmod +x ./install
sudo ./install auto
sleep 10
sudo service codedeploy-agent start
sudo service codedeploy-agent status

#install cloudwatch agent
sudo yum install amazon-cloudwatch-agent -y
rpm -qa amazon-cloudwatch-agent
ps aux | grep amazon-cloudwatch-agent
sudo systemctl start amazon-cloudwatch-agent.service

# Install pm2
npm install
sudo npm install -g pm2


