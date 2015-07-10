ssh admin@104.131.56.5 "
    cd /opt/panel-beta
    pm2 stop panel-beta
    git pull
    echo 'Current version is:'
    git rev-parse --short HEAD
    git rev-parse --short HEAD > public/version.txt 
    pm2 restart panel-beta
"
