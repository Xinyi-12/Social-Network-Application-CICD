#!/bin/bash

sudo echo 'export PATH=$PATH:/home/ec2-user/node_modules/pm2/bin' | sudo tee -a source ~/.bash_profile
sudo rm -rf /home/ec2-user/.pm2
source /home/ec2-user/.bash_profile
# cd /home/ec2-user
pm2 flush 
pm2 stop all
pm2 delete all
sudo npm -i
# pm2 start ./index.js
pm2 start /home/ec2-user/index.js

sudo systemctl start amazon-cloudwatch-agent.service
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
    -a fetch-config \
    -m ec2 \
    -c file:/home/ec2-user/cloudwatch-config.json \
    -s
    
# /usr/local/bin/pm2 start ~/index.js 


