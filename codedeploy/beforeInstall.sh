#!/bin/bash
export PATH=/home/ec2-user/.nvm/versions/node/v17.8.0/bin:/usr/local/bin:/usr/local/sbin:/home/ec2-user/.local/bin:/home/ec2-user/bin:$PATH

pm2 stop app.js
pm2 delete all
sudo ps -ef | grep /etc/.pm2 |cut -c 9-15 | xargs sudo kill -9
sudo ps -ef | grep /home/ec2-user/.pm2 |cut -c 9-15 | xargs sudo kill -9
sudo rm -rf /home/ec2-user/config/db.config.js
# sudo mv -f /home/ec2-user/model/config.js /home/ec2-user
sudo rm -rf /home/ec2-user/codedeploy
# sudo rm -rf /home/ec2-user/cloudformation
sudo rm -rf /home/ec2-user/packer
# sudo rm -rf /home/ec2-user/aws
sudo rm -rf /home/ec2-user/routes
sudo rm -rf /home/ec2-user/controller
sudo rm -rf /home/ec2-user/service
sudo rm -rf /home/ec2-user/authorization.js
sudo rm -rf /home/ec2-user/s3.js
# sudo rm -rf /home/ec2-user/util
# sudo rm -rf /home/ec2-user/healthz.js
sudo rm -rf /home/ec2-user/index.js
sudo rm -rf /home/ec2-user/package.json
# sudo rm -rf /home/ec2-user/node_modules 
sudo rm -rf /home/ec2-user/package-lock.json
# sudo rm -rf /home/ec2-user/ami.json
sudo rm -rf /home/ec2-user/appspec.yml
sudo rm -rf /home/ec2-user/README.md 
# sudo rm -rf /home/ec2-user/test.js
# sudo rm -rf /home/ec2-user/buildAmi.sh
