#!/bin/bash
source ~/.bash_profile
# source /home/ec2-user/.bash_profile
# sudo mv -f /home/ec2-user/config.js /home/ec2-user/model/
cd /home/ec2-user/
sudo chmod 775 /home/ec2-user/node_modules
# export NVM_DIR="$HOME/.nvm"
# [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
# [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" # This loads nvm
# sleep 10
# npm cache clean --force
# npm update
# npm install
npm -f install
sudo rm -rf /home/ec2-user/.pm2
sudo amazon-cloudformation-agent-ctl -m ec2 -a start
sudo amazon-cloudformation-agent-ctl -m ec2 -a status
