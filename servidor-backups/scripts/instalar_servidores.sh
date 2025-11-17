#!/bin/bash

echo "========================================"
echo "   Instalando servidores NVS (UTU 2025)"
echo "========================================"

echo "=== Actualizando paquetes ==="
sudo apt update -y
sudo apt upgrade -y

echo "=== Instalando dependencias ==="
sudo apt install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    ufw \
    openssh-server

echo "=== Instalando Docker ==="

# Crear directorio para llaves si no existe
sudo install -m 0755 -d /etc/apt/keyrings

# Agregar key oficial de Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
    | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Agregar repositorio Docker
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update -y

# Instalar Docker Engine
sudo apt install -y \
    docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

echo "=== Verificando instalación de Docker ==="
sudo systemctl enable docker
sudo systemctl start docker

echo "=== Copiando proyecto a /opt/nvs ==="
sudo mkdir -p /opt/nvs

sudo cp -r ./servidor-app /opt/nvs/
sudo cp -r ./servidor-db /opt/nvs/
sudo cp -r ./servidor-backups /opt/nvs/
sudo cp ./docker-compose.yml /opt/nvs/

echo "=== Levantando contenedores con Docker Compose ==="
cd /opt/nvs
sudo docker compose up -d --build

echo "=== Configuración de firewall (UFW) ==="
sudo ufw allow 22/tcp     # SSH
sudo ufw allow 80/tcp     # Web App
sudo ufw allow 3306/tcp   # MySQL
echo "y" | sudo ufw enable

echo "=== Habilitando SSH ==="
sudo systemctl enable ssh
sudo systemctl start ssh

echo "=============== COMPLETADO ==============="
echo "Todos los servidores fueron instalados correctamente."
echo "Ubicación del proyecto: /opt/nvs"
echo "=========================================="
