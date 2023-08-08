echo "Kill all the running PM2 actions"
sudo pm2 kill

echo "Jump to app folder"
cd /var/www/nimbus-api

echo "Install app dependencies"
sudo pnpm install

echo "Run new PM2 action"
sudo cp /root/ecosystem.json ecosystem.json
sudo pm2 start ecosystem.json