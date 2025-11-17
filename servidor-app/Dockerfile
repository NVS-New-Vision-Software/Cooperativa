FROM php:8.2-apache

# Extensiones necesarias para MySQL
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Habilitar mod_rewrite si querés URLs limpias
RUN a2enmod rewrite

# Copiar toda tu app al servidor Apache
COPY src/ /var/www/html/

# Dar permisos a Apache
RUN chown -R www-data:www-data /var/www/html

EXPOSE 80
