# TODO APP
Simple test application

Installation
1. Install NodeJS
## Enable the NodeSource repository by running the following curl command as a user with sudo privileges 
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -

## Once the NodeSource repository is enabled, install Node.js and npm by typing:
sudo apt-get install -y nodejs

2. Install MongoDB
## Import the public key used by the package management system.
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

## Create the /etc/apt/sources.list.d/mongodb-org-6.0.list file for Ubuntu 20.04 (Focal)
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

## Reload local package database.
sudo apt-get update

## Install the MongoDB packages.
sudo apt-get install -y mongodb-org

3. Running App
## Create .env file and add 
DATABASE_URL = "mongodb://localhost:27017/todoList"

## Install packages by running below command
npm install or yarn

## Run App
npm start or yarn start


