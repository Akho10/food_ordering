# Beginner Deployment Walkthrough

This guide explains the current Docker, Jenkins, and AWS EC2 setup, what has been tested, and what still needs to happen before users can access a live site.

## Current Status

The repository now has Docker builds for the frontend and backend, a Compose configuration for the frontend/API/MySQL containers, and a Jenkins pipeline designed to run Jenkins and the application on the same EC2 instance. Jenkins builds and publishes images to Docker Hub, then deploys the `main` branch using the instance's local Docker daemon.

Verified locally: the Angular production build passes, both Docker images build, Compose configuration parses, and the frontend page returns HTTP 200 through Nginx. The API request through Nginx (`/api/products/list`) timed out in the local smoke test. That issue remains unresolved, so the application is not yet verified end to end.

The application EC2 instance has been created and prepared with Docker and its environment file. Jenkins has not yet been installed, and the pipeline has not been run on the EC2 instance. Follow the setup below to continue.

## How the Pieces Fit Together

- **Angular** is the page users see in their browser.
- **Nginx** serves the Angular files. Requests beginning with `/api/` are forwarded to the Spring Boot API.
- **Spring Boot API** handles product and order requests and reads/writes data in MySQL.
- **MySQL** runs in its own container. Its data is stored in a named Docker volume so a redeployment does not remove the database.
- **Docker image** is a packaged version of an application. A **container** is a running instance of an image.
- **Docker Hub** stores the versioned images so EC2 can download them.
- **Jenkins** runs on the same EC2 instance, checks out the repository, builds both images, publishes them, then restarts the Compose application locally with the new image tag.
- **EC2** is the AWS virtual machine that runs the public application containers.

Traffic path:

```text
User browser --HTTP port 80--> EC2 / Nginx --/api requests--> Spring Boot API --> MySQL
Jenkins --push images--> Docker Hub
Jenkins on EC2 --local Docker Compose--> application containers
```

Only Nginx is exposed to users. The API and MySQL ports are private to the Docker network.

## 1. Create Docker Hub Repositories

Create a Docker Hub account, then create two **public** repositories under it:

- `food-ordering-api`
- `food-ordering-frontend`

Public repositories let EC2 download images without a Docker Hub login. The Jenkins pipeline will publish images with a tag based on the Git commit, for example `a1b2c3d4e5f6`.

There are two repositories because this application has two independently built services with different runtimes: the Spring Boot API uses [backend/Dockerfile](backend/Dockerfile), and the Angular frontend served by Nginx uses [frontend/Dockerfile](frontend/Dockerfile). This keeps their versions and updates separate. MySQL uses the existing public `mysql:8.4` image, so it does not need a repository under your account.

You create the two empty Docker Hub repositories once. Docker itself builds the images: on a Jenkins build, the `docker build` commands in [Jenkinsfile](Jenkinsfile) read each service's Dockerfile and create a tagged image on the Jenkins agent. Jenkins then runs `docker push` to upload those images to Docker Hub. During deployment, Compose on EC2 runs `docker compose pull` to download the tagged images. Docker Hub stores the images; it does not build the application in this setup.

## 2. Create and Prepare the EC2 Instance

In AWS, launch an Ubuntu 24.04 EC2 instance. For a demonstration, choose an instance size with enough memory and disk for Java, Docker, and MySQL. Add a security group with these inbound rules:

- TCP `80` from `0.0.0.0/0` so users can open the site.
- TCP `22` only from your current public IP for SSH administration.
- TCP `8080` only from your current public IP for the Jenkins web interface.
- Do not open TCP `3306` to the internet. The API's port 8080 is not published by Compose; only Jenkins listens on host port 8080.

You do not need Jenkins configured before creating EC2. Set the SSH rule's source to your own current public IP with `/32` (one IP) so you can connect and prepare the server. Restrict the Jenkins port 8080 rule to your current public IP as well. Since Jenkins will run on this same instance, no Jenkins-to-EC2 SSH rule is needed. Keep both rules restricted to trusted IPs.

Connect to the instance as `ubuntu`, then install Docker and Compose:

```sh
sudo apt update
sudo apt install -y docker.io docker-compose-v2
sudo systemctl enable --now docker
sudo usermod -aG docker ubuntu
sudo mkdir -p /opt/food-ordering
sudo chown ubuntu:ubuntu /opt/food-ordering
```

Log out and reconnect after adding the user to the Docker group. Confirm `docker compose version` works without `sudo`.

### Install Jenkins on this EC2 instance

Install Java and Jenkins on the same Ubuntu instance:

```sh
sudo apt update
sudo apt install -y fontconfig openjdk-21-jre curl gnupg
sudo install -d -m 0755 /etc/apt/keyrings
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | gpg --dearmor | sudo tee /etc/apt/keyrings/jenkins-keyring.gpg > /dev/null
sudo chmod 644 /etc/apt/keyrings/jenkins-keyring.gpg
echo "deb [signed-by=/etc/apt/keyrings/jenkins-keyring.gpg] https://pkg.jenkins.io/debian-stable binary/" | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
sudo apt update
sudo apt install -y jenkins
sudo systemctl enable --now jenkins
```

Let the Jenkins service use Docker and read the EC2 environment file. The Jenkins user will own the private file; you can still edit it later with `sudo nano`:

```sh
sudo usermod -aG docker jenkins
sudo chown jenkins:jenkins /opt/food-ordering/.env
sudo chmod 600 /opt/food-ordering/.env
sudo systemctl restart jenkins
```

Docker-group access gives Jenkins powerful control of the host, so only trusted users should have Jenkins administrator access. A small EC2 instance may not have enough memory for Jenkins, MySQL, and application builds together; 4 GB RAM is a more practical demonstration size.

## 3. Set Up the EC2 Environment File

The Compose file needs database passwords. The real `.env` file stays on EC2 and is not sent by Jenkins. From the repository root, create a local copy of the example:

```sh
cp .env.example .env
```

Edit `.env` and replace both example passwords with different, long random values. Set `DOCKERHUB_NAMESPACE` to your Docker Hub username or organization. Send the file to EC2 using a secure connection, then protect it:

```sh
scp .env ubuntu@YOUR_EC2_PUBLIC_DNS:/tmp/food-ordering.env
ssh ubuntu@YOUR_EC2_PUBLIC_DNS 'mv /tmp/food-ordering.env /opt/food-ordering/.env && chmod 600 /opt/food-ordering/.env'
```

The example file is safe to commit; the real `.env` file is ignored by Git. Do not put production passwords in the repository or Jenkinsfile.

## 4. Configure Jenkins

Open `http://YOUR_EC2_PUBLIC_DNS:8080/` from an IP allowed by the security group. Retrieve the initial administrator password on EC2 with:

```sh
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

Unlock Jenkins, install the suggested plugins plus **Pipeline** and **Credentials Binding**, and create the Jenkins administrator account. Configure a **Multibranch Pipeline** job pointing to this Git repository. The Jenkins agent is the same EC2 instance, so it uses the Docker Engine installed above.

Check the settings near the top of [Jenkinsfile](Jenkinsfile):

- `DOCKERHUB_NAMESPACE`: your Docker Hub username or organization. It is currently set to `liliza`.

The pipeline reads database credentials from `/opt/food-ordering/.env` on EC2. It deploys locally, so no EC2 SSH deployment key or `DEPLOY_HOST` is needed.

Add this Jenkins credential with the exact ID below:

- **ID:** `dockerhub-credentials`; **kind:** username with password; use your Docker Hub username and an access token as the password.

The Jenkins administrator password and Docker Hub access token are different credentials. Do not put either in the Jenkinsfile or repository.

## 5. Enable Automatic Builds and Deployment

In the Multibranch Pipeline configuration, set the repository URL and credentials if the repository is private, then scan the repository so Jenkins discovers the `main` branch. For a beginner setup, enable the multibranch job's periodic scan (for example, every five minutes) so Jenkins notices new commits without opening the Jenkins interface to all of GitHub. A GitHub webhook can be added later behind HTTPS if you want near-immediate builds.

After configuration, push a change to the repository. Jenkins will build and publish new images for that commit. Only the `main` branch runs the EC2 deployment stage; other branches can build and publish but are not deployed.

The deployment stage pulls the new commit-tagged images and runs Docker Compose on the EC2 host using `/opt/food-ordering/.env`. The environment file is not copied or printed by the pipeline. After a successful deployment, open:

```text
http://YOUR_EC2_PUBLIC_DNS/
```

## 6. Run Locally

Create `.env` from `.env.example`, replace the example passwords and Docker Hub namespace, then run from the repository root:

```sh
docker compose up --build -d
```

Open `http://localhost/`. To stop the local app without deleting its database volume, run:

```sh
docker compose down
```

## What Is Not Finished Yet

- The local homepage returned HTTP 200, but `/api/products/list` timed out through Nginx. Fix and retest this API path before relying on the deployed app.
- Jenkins has not yet been installed on EC2 or used to execute the pipeline.
- The pipeline builds the backend with Maven tests skipped and does not yet have a separate automated test stage. It currently verifies that the Docker images build, not that all application behavior passes tests.
- This demo uses HTTP and one EC2 host for both Jenkins and the application. Jenkins and application workloads share the instance's resources, and a host failure takes down both. Add HTTPS before collecting sensitive information, and configure backups for MySQL data before using real customer data. A Docker volume alone is not a backup.