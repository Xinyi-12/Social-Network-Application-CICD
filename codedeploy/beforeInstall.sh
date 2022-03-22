#!/bin/bash
source /home/ec2-user/.bash_profile
export PATH=/home/ec2-user/.nvm/versions/node/v17.8.0/bin:/usr/local/bin:/usr/local/sbin:/home/ec2-user/.local/bin:/home/ec2-user/bin:$PATH

pm2 stop index.js
pm2 delete all
sudo ps -ef | grep /etc/.pm2 |cut -c 9-15 | xargs sudo kill -9
sudo ps -ef | grep /home/ec2-user/.pm2 |cut -c 9-15 | xargs sudo kill -9
sudo rm -rf /home/ec2-user/codedeploy
sudo rm -rf /home/ec2-user/config
sudo rm -rf /home/ec2-user/controller
sudo rm -rf /home/ec2-user/file
sudo rm -rf /home/ec2-user/model
sudo rm -rf /home/ec2-user/node_modules 
sudo rm -rf /home/ec2-user/packer
sudo rm -rf /home/ec2-user/packer/ami.json
sudo rm -rf /home/ec2-user/packer/buildAmi.sh
sudo rm -rf /home/ec2-user/routes
sudo rm -rf /home/ec2-user/service
sudo rm -rf /home/ec2-user/tests
sudo rm -rf /home/ec2-user/.env
sudo rm -rf /home/ec2-user/appspec.yml
sudo rm -rf /home/ec2-user/authorization.js
sudo rm -rf /home/ec2-user/index.js
sudo rm -rf /home/ec2-user/package-lock.json
sudo rm -rf /home/ec2-user/package.json
sudo rm -rf /home/ec2-user/README.md 
sudo rm -rf /home/ec2-user/s3.js
sudo rm -rf /home/ec2-user/test.txt
sudo rm -rf /home/ec2-user/cloudwatch-config.json

