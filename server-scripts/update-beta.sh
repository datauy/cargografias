ssh admin@104.131.56.5 "
    cd /opt/beta
    pm2 stop beta
    git pull
    echo 'Current version is:'
    git rev-parse --short HEAD
    git rev-parse --short HEAD > web/version.txt 
    pm2 restart beta
"
