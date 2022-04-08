#!/bin/bash
sudo echo 'export PATH=$PATH:/home/ec2-user/node_modules/pm2/bin' | sudo tee -a source ~/.bash_profile

cd /home/ec2-user
sudo npm -i
pm2 start index.js

