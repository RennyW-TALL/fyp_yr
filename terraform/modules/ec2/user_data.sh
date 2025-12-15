#!/bin/bash
set -e

# Update system
apt-get update -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
usermod -aG docker ubuntu

# Install AWS CLI v2
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
apt-get install -y unzip
unzip awscliv2.zip
./aws/install

# Install MySQL client
apt-get install -y mysql-client

# Install SSM Agent (usually pre-installed on Ubuntu AMIs)
snap install amazon-ssm-agent --classic
systemctl enable snap.amazon-ssm-agent.amazon-ssm-agent.service
systemctl start snap.amazon-ssm-agent.amazon-ssm-agent.service

# Create deployment script
cat > /home/ubuntu/deploy.sh << 'EOF'
#!/bin/bash
set -e

ECR_REPO="${ecr_repository_url}"
REGION=$(curl -s http://169.254.169.254/latest/meta-data/placement/region)

# Login to ECR
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ECR_REPO

# Pull and run latest image
docker pull $ECR_REPO:latest
docker stop backend-app || true
docker rm backend-app || true
docker run -d --name backend-app -p 80:80 $ECR_REPO:latest
EOF

chmod +x /home/ubuntu/deploy.sh
chown ubuntu:ubuntu /home/ubuntu/deploy.sh

# Create systemd service for auto-deployment
cat > /etc/systemd/system/backend-deploy.service << EOF
[Unit]
Description=Backend Deployment Service
After=docker.service

[Service]
Type=oneshot
User=ubuntu
ExecStart=/home/ubuntu/deploy.sh
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable backend-deploy.service