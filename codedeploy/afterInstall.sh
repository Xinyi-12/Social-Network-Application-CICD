#!/bin/bash
source ~/.bash_profile
sudo mv -f /home/ec2-user/config.js /home/ec2-user/model/
cd /home/ec2-user/
sudo chmod 775 /home/ec2-user/node_modules
npm -f install
sudo rm -rf /home/ec2-user/.pm2