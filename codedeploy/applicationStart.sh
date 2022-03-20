#!/bin/bash
sudo echo 'export PATH=$PATH:/home/ec2-user/node_modules/pm2/bin' | sudo tee -a source ~/.bash_profile
sudo rm -rf /home/ec2-user/.pm2
source ~/.bash_profile
pm2 flush 
pm2 stop all
pm2 delete all
cd /home/ec2-user/
# ls
pm2 start index.js

