# Express.js CI/CD Pipeline with GitHub Actions & Docker

A professional, containerized Node.js web application utilizing Express.js, Docker, and GitHub Actions for a fully automated Continuous Integration and Continuous Deployment (CI/CD) pipeline to an AWS EC2 instance.

---

## 🏗️ Architecture Diagram

This diagram illustrates how the local workspace, GitHub repository, GitHub Actions runner, and target EC2 server interact during development and deployment:

```mermaid
graph TD
    %% Define Nodes
    Dev[💻 Developer] -->|1. Push to master| GitHub[🐙 GitHub Repository]
    
    subgraph GitHub_Actions [☁️ GitHub Actions Runner]
        Trigger[⚡ Workflow Triggered] --> Checkout[📥 Checkout Code]
        Checkout --> SSH_Connect[🔑 SSH Connection via appleboy/ssh-action]
    end
    
    GitHub -->|Trigger Workflow| Trigger
    
    subgraph Production_Server [🖥️ AWS EC2 Instance]
        SSH_Daemon[🔒 SSH Daemon]
        Git_Pull[🔄 git pull]
        Docker_Compose[🐳 docker compose up -d --build]
        App_Container[📦 Express App Container]
    end
    
    SSH_Connect -->|2. Secure SSH Session| SSH_Daemon
    SSH_Daemon -->|3. Commands Executed| Git_Pull
    Git_Pull -->|4. Update Code| Docker_Compose
    Docker_Compose -->|5. Build & Run| App_Container
    
    User[🌐 End User] -->|HTTP Request on Port 5000| App_Container
```

---

## 🔄 CI/CD Deployment Flow

Below is the step-by-step process of the pipeline execution when a push event occurs:

```mermaid
sequenceDiagram
    autonumber
    actor Dev as Developer
    participant GH as GitHub Repo
    participant GA as GitHub Actions Runner
    participant EC2 as AWS EC2 Server
    
    Dev->>GH: Push changes to `master` branch
    activate GH
    GH->>GA: Trigger Deploy Workflow (`deploy.yml`)
    deactivate GH
    
    activate GA
    GA->>GA: Checkout Repository Code
    GA->>EC2: SSH connection using SSH_KEY secrets
    activate EC2
    
    Note over EC2: Commands:
    Note over EC2: 1. cd /home/ubuntu/git_actions
    Note over EC2: 2. git pull
    Note over EC2: 3. docker compose up -d --build
    
    EC2->>EC2: Pull latest changes from Github
    EC2->>EC2: Rebuild Docker image & start container
    EC2-->>GA: SSH script execution completed
    deactivate EC2
    
    GA-->>Dev: Pipeline Status: Success ✅
    deactivate GA
```

---

## 🚀 Key Features

* **Continuous Deployment (CD)**: Zero-manual deployment. Any commit pushed to the `master` branch is instantly deployed to the cloud.
* **Containerized Architecture**: Packaged using Docker to ensure environment parity between local development and production.
* **Process Management**: Automatically restarts the application unless manually stopped (`restart: unless-stopped` in Docker Compose).
* **Environment Configuration**: Robust environment variable handling via `.env` files.

---

## 🛠️ Tech Stack

* **Runtime Environment**: Node.js (v22-alpine)
* **Web Framework**: Express.js
* **Process Manager**: Nodemon (for development)
* **Containerization**: Docker & Docker Compose
* **CI/CD Platform**: GitHub Actions

---

## 💻 Local Setup & Installation

### Prerequisites
Make sure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v22 or later)
* [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

### Steps
1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd git_actions
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Run in Development Mode:**
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:5000` with hot-reloading enabled via `nodemon`.

### Running locally with Docker
To test the production container configuration locally:
```bash
docker compose up --build
```

---

## 🌐 Production Server Configuration (AWS EC2)

To set up the application on your Ubuntu-based target server:

1. **Install Docker and Docker Compose:**
   ```bash
   sudo apt update
   sudo apt install docker.io docker-compose-v2 -y
   ```

2. **Configure Docker Permissions** (so that `ubuntu` user can run docker without `sudo`):
   ```bash
   sudo usermod -aG docker $USER
   newgrp docker
   ```

3. **Clone the repository** into `/home/ubuntu/git_actions`:
   ```bash
   git clone <your-repository-url> /home/ubuntu/git_actions
   ```

---

## 🔑 GitHub Actions Secrets Setup

For the CI/CD pipeline to work correctly, add the following secrets in your GitHub repository settings under **Settings** ➔ **Secrets and variables** ➔ **Actions**:

| Secret Key | Description | Example Value |
|---|---|---|
| `SSH_HOST` | The public IP address or DNS of your server | `ec2-13-127-245-217.ap-south-1.amazonaws.com` |
| `SSH_KEY` | The private SSH key used to authenticate with your server | Contents of your `gitaction.pem` |
