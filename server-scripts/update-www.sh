ssh admin@104.131.56.5 "
    cd /opt/www
    pm2 stop www
    git pull
    echo 'Current version is:'
    git rev-parse --short HEAD
    git rev-parse --short HEAD > web/version.txt 
    pm2 restart www
"
