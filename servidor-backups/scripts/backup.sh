#!/bin/bash

DATE=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_DIR="/backups"
MYSQL_HOST="servidor-db"
MYSQL_USER="nvs_app"
MYSQL_PASS="AppStrongPassword!"
DB_NAME="nvs_db"

mkdir -p $BACKUP_DIR

mysqldump -h $MYSQL_HOST -u $MYSQL_USER -p$MYSQL_PASS $DB_NAME > "$BACKUP_DIR/backup_$DATE.sql"

echo "[OK] Backup generado: backup_$DATE.sql"
