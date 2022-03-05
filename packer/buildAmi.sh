#!/bin/bash
packer build -var-file='infrastructure/packer/vars.json' ami.json
#!/bin/sh
sleep 30
# Install node js
sudo yum install -y gcc-c++ make

sudo yum install --assumeyes curl
curl --silent --location https://rpm.nodesource.com/setup_14.x | sudo bash -
sudo yum install -y nodejs

node -v

# Install pm2
sudo npm install -g pm2

#install mysql
sudo yum update -y
sudo systemctl enable --now mysqld
sudo yum install -y https://dev.mysql.com/get/mysql80-community-release-el7-3.noarch.rpm
sudo rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2022
sudo yum install -y mysql-community-server
sudo systemctl stop mysqld
sudo systemctl set-environment MYSQLD_OPTS='--skip-grant-tables'
sudo systemctl start mysqld
mysql -u root -Bse \"FLUSH PRIVILEGES;ALTER USER 'root'@'localhost' IDENTIFIED by 'Greed36381190715@';CREATE DATABASE cloudComputing;\"
sudo systemctl stop mysqld
sudo systemctl unset-environment MYSQLD_OPTS
sudo systemctl enable --now mysqld
sudo mysql -u root -p"Greed36381190715@" -e "
CREATE DATABASE  IF NOT EXISTS $(cloudComputing)/*!40100 DEFAULT CHARACTER SET utf8 */;
USE $(cloudComputing);
USE $( cloudComputing);
DROP TABLE IF EXISTS $(users);
CREATE TABLE $(users) (
  $(id) int(11) NOT NULL AUTO_INCREMENT,
  $(firstName) varchar(45) NOT NULL,
  $(lastName) varchar(45) NOT NULL,
  $(emailId) varchar(45) NOT NULL,
  $(password) varchar(100) NOT NULL,
  PRIMARY KEY ($(id)),
  UNIQUE KEY $(emailId_UNIQUE) ($(emailId))
) ENGINE=InnoDB AUTO_INCREMENT=142 DEFAULT CHARSET=utf8;
LOCK TABLES $(users) WRITE;
UNLOCK TABLES;
show tables;
"


sudo pm2 start ./index.js
sudo pm2 startup systemd
sudo pm2 save
sudo pm2 list