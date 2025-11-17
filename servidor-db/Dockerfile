FROM mysql:8.0

ENV MYSQL_ROOT_PASSWORD=RootPassword!
ENV MYSQL_DATABASE=nvs_db
ENV MYSQL_USER=nvs_app
ENV MYSQL_PASSWORD=AppStrongPassword!

COPY init.sql /docker-entrypoint-initdb.d/init.sql
