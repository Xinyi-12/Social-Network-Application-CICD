#!/bin/sh
sleep 10

#install mysql
sudo yum install -y mysql-community-server
sudo systemctl stop mysqld
sudo systemctl set-environment MYSQLD_OPTS='--skip-grant=tables'
sudo systemctl start mysqld
mysql -u root -Bse \ "FLUSH PRIVILEGES;ALTER USER 'root'@localhost" IDENTIFIED by 'chen'
sudo systemctl stop mysqld
sudo systemctl unset-environment MYSQLD_OPTS
sudo systemctl start mysqld
sudo mkdir -p /usr/local/lib/nodejs


