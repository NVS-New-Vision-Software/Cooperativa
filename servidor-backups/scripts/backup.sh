#!/bin/bash

while true
do
  TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
  mysqldump -h servidor-db -u root -proot nvs_db > /backup/backup_$TIMESTAMP.sql
  echo "Backup generado: backup_$TIMESTAMP.sql"
  sleep 3600
done
