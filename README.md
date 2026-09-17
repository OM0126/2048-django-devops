# 2048 Django DevOps Project

A 2048 game built using Django, HTML, CSS, and JavaScript.

The main goal of this project is to build the game first and then use it to learn and implement a complete DevOps and CI/CD workflow.

---

## Project Overview

This project will be developed in different stages.

First, the 2048 game will run locally using Django.

After the application is stable, we will add DevOps tools and deploy the application to AWS.

The final project will include:

* Django
* HTML
* CSS
* JavaScript
* Git and GitHub
* GitHub Actions
* Docker
* Docker Hub
* PostgreSQL
* AWS
* Terraform
* Kubernetes
* Prometheus
* Grafana
* Trivy

---

## Current Project

The application is currently running locally using Django.

Local URL:

```text
http://127.0.0.1:8000/
```

---

## What We Have Done

### 1. Django Project

Created a Django project called:

```text
game_2048
```

Created a Django application:

```text
game
```

The Django application is working correctly.

---

### 2. Game Page

Created the main 2048 game page using HTML.

The page contains:

* 2048 title
* Game board
* 4 x 4 grid
* Score
* Best score
* New Game button
* Game instructions

---

### 3. CSS

Added CSS to design the game.

Current CSS includes:

* Game board design
* Score boxes
* Buttons
* Responsive layout
* Different colors for different tiles

For example:

```text
2
4
8
16
32
64
128
256
512
1024
2048
```

Each tile has a different style.

---

### 4. JavaScript Game Logic

Implemented the main 2048 game logic using JavaScript.

The game currently supports:

* Creating a new game
* Generating random tiles
* Moving tiles
* Merging tiles
* Calculating score
* Saving the best score
* Detecting 2048
* Detecting game over

---

### 5. Keyboard Controls

The game can currently be played using:

```text
Arrow Up
Arrow Down
Arrow Left
Arrow Right
```

---

# Project Structure

Current project structure:

```text
game_2048/
│
├── manage.py
├── db.sqlite3
│
├── game/
│   ├── admin.py
│   ├── apps.py
│   ├── migrations/
│   ├── models.py
│   ├── tests.py
│   ├── urls.py
│   ├── views.py
│   │
│   ├── templates/
│   │   └── game/
│   │       └── index.html
│   │
│   └── static/
│       └── game/
│           ├── css/
│           │   └── style.css
│           └── js/
│               └── game.js
│
└── game_2048/
    ├── settings.py
    ├── urls.py
    ├── asgi.py
    └── wsgi.py
```

---

# Future Game Features

Before starting the full DevOps setup, the game will be improved.

Planned features:

* Tile merge animations
* Smooth tile movement
* Mobile swipe controls
* Custom win popup
* Custom game-over popup
* Restart animation
* Dark mode
* User registration
* User login
* User logout
* Score storage
* Leaderboard

---

# DevOps Plan

After the game is stable, we will start the DevOps part.

## 1. Git and GitHub

The project will be stored in GitHub.

We will use Git for:

* Version control
* Commits
* Branches
* Pull requests
* Project history

---

## 2. Testing

Automated tests will be added to the Django project.

Tests will check important parts of the application before deployment.

---

## 3. GitHub Actions

GitHub Actions will be used for Continuous Integration.

The pipeline will perform tasks such as:

```text
Git Push
   |
   v
GitHub Actions
   |
   +-- Install dependencies
   |
   +-- Run tests
   |
   +-- Check code
   |
   +-- Build application
   |
   +-- Build Docker image
```

---

## 4. Docker

The Django application will be containerized using Docker.

The goal is to make the application run consistently on different systems.

---

## 5. Docker Hub

The Docker image will be pushed to Docker Hub.

The planned flow is:

```text
GitHub
   |
   v
GitHub Actions
   |
   v
Docker Build
   |
   v
Docker Hub
```

---

## 6. PostgreSQL

The project currently uses SQLite for local development.

Later, PostgreSQL will be added for a production-style database.

---

## 7. AWS

After Docker is working locally, the application will be deployed to AWS.

AWS services will be introduced step-by-step.

Possible services include:

* EC2
* VPC
* Security Groups
* Load Balancer
* IAM
* CloudWatch

---

## 8. Terraform

Terraform will be used to create and manage AWS infrastructure.

Instead of creating infrastructure manually, we will use Infrastructure as Code.

Example:

```bash
terraform init
terraform plan
terraform apply
```

---

## 9. Kubernetes

Kubernetes will be added after the Docker and AWS setup is understood.

The application will eventually run using multiple containers or pods.

Basic planned structure:

```text
Kubernetes
    |
    +-- Pod
    |
    +-- Pod
    |
    +-- Pod
    |
    +-- Service
```

---

## 10. Continuous Deployment

After CI is working, Continuous Deployment will be added.

The final deployment flow will look like:

```text
Developer
    |
    v
Git Push
    |
    v
GitHub
    |
    v
GitHub Actions
    |
    +-- Test
    +-- Build
    +-- Security Scan
    |
    v
Docker Hub
    |
    v
AWS / Kubernetes
    |
    v
Running Application
```

---

## 11. Security

Security tools will be added to the pipeline.

Trivy will be used to scan Docker images for known vulnerabilities.

Other security practices will include:

* GitHub Secrets
* Environment variables
* AWS IAM
* Secure Docker configuration
* Kubernetes Secrets

---

## 12. Monitoring

Monitoring will be added after deployment.

The planned monitoring stack is:

```text
Application
    |
    v
Kubernetes
    |
    +---- Prometheus
    |
    +---- Grafana
```

Prometheus will collect metrics and Grafana will be used to display them.

---

# Final Goal

The final project will be a Django 2048 game with a complete DevOps pipeline.

The complete flow will be:

```text
Develop
   |
   v
Git
   |
   v
GitHub
   |
   v
Test
   |
   v
GitHub Actions
   |
   v
Docker
   |
   v
Docker Hub
   |
   v
Terraform
   |
   v
AWS
   |
   v
Kubernetes
   |
   v
Continuous Deployment
   |
   v
Prometheus + Grafana
```

The project will be built step-by-step, starting with local development and moving to cloud deployment only after each stage is working correctly.

---

## Current Status

| Feature               | Status      |
| --------------------- | ----------- |
| Django setup          | Completed   |
| Game page             | Completed   |
| CSS styling           | Completed   |
| Tile colors           | Completed   |
| JavaScript game logic | Completed   |
| Keyboard controls     | Completed   |
| GitHub                | In progress |
| Game animations       | Planned     |
| Mobile controls       | Planned     |
| Authentication        | Planned     |
| Leaderboard           | Planned     |
| Automated tests       | Planned     |
| GitHub Actions        | Planned     |
| Docker                | Planned     |
| Docker Hub            | Planned     |
| PostgreSQL            | Planned     |
| AWS                   | Planned     |
| Terraform             | Planned     |
| Kubernetes            | Planned     |
| Continuous Deployment | Planned     |
| Trivy                 | Planned     |
| Prometheus            | Planned     |
| Grafana               | Planned     |
