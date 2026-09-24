2048 Django DevOps Project

A simple 2048 game built with Django and deployed using Docker, Kubernetes, AWS EKS, and GitHub Actions.

The main goal of this project was to learn how an application moves from code → Docker → CI/CD → Kubernetes → AWS.

1. Project Overview

This project started as a simple Django 2048 game.

Then we added DevOps tools step by step:

Git and GitHub

Docker

Docker Hub

GitHub Actions

AWS EC2

Kubernetes

Minikube

Prometheus

Grafana

AWS EKS

AWS EBS storage

GitHub OIDC

Automatic deployment to EKS

2. Final Architecture

Developer
   |
   | git push
   v
GitHub
   |
   v
GitHub Actions
   |
   +--> Run Django tests
   |
   +--> Build Docker image
   |
   +--> Push image to Docker Hub
   |
   +--> Login to AWS using GitHub OIDC
   |
   +--> Connect to EKS
   |
   +--> Update Kubernetes Deployment
   |
   v
AWS EKS
   |
   v
2048 Django Pod
   |
   v
Kubernetes Service
   |
   v
User

For monitoring:

Kubernetes
    |
    v
Metrics Server
    |
    v
Prometheus
    |
    v
Grafana

3. Django Application

The application is a 2048 game made with Django.

Main features:

4x4 game board

Move tiles

Merge tiles

Score

Best score

New Game

Win condition

Game Over condition

Local storage for best score

The application runs on port:

8000

4. Run Django Locally

Install dependencies:

python -m pip install --upgrade pip
pip install -r requirements.txt

Run tests:

python manage.py test

Start the application:

python manage.py runserver

Open:

http://127.0.0.1:8000/

5. Git and GitHub

We used Git to manage the project code.

Basic commands:

git status
git add .
git commit -m "message"
git push origin main
git pull
git log --oneline

The GitHub repository is:

OM0126/2048-django-devops

6. Docker

We created a Docker image for the Django application.

Dockerfile:

FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

Build the image:

docker build -t 2048:latest .

Run the container:

docker run -d   --name 2048-app   -p 8000:8000   2048:latest

Check the container:

docker ps

Check logs:

docker logs 2048-app

7. Docker Hub

We pushed the Docker image to Docker Hub.

Image:

om0126/2048-django-devops

Login:

docker login

Build:

docker build -t om0126/2048-django-devops:latest .

Push:

docker push om0126/2048-django-devops:latest

Docker Hub is used as our container image storage.

8. AWS EC2 Deployment

Before Kubernetes, we also deployed the Docker container on AWS EC2.

Basic process:

Docker Hub
    |
    v
AWS EC2
    |
    v
Docker Container
    |
    v
Django 2048

Commands used on EC2:

docker pull om0126/2048-django-devops:latest

docker run -d   --name 2048-app   -p 8000:8000   om0126/2048-django-devops:latest

Check:

docker ps
docker logs 2048-app

We also fixed a Django DisallowedHost problem during the EC2 deployment.

9. GitHub Actions

GitHub Actions was used to automate the project.

The pipeline does:

Code Push
   |
   v
Run Tests
   |
   v
Build Docker Image
   |
   v
Push Image to Docker Hub
   |
   v
Deploy

The first version deployed the application to EC2.

Later, we changed the deployment target to EKS.

10. Kubernetes

We used Kubernetes to manage the Docker application.

Main Kubernetes resources:

Deployment

Service

ConfigMap

Secret

PersistentVolumeClaim

Basic commands:

kubectl get nodes
kubectl get pods
kubectl get deployments
kubectl get services
kubectl get pvc

Apply a file:

kubectl apply -f <file>.yaml

Check pod details:

kubectl describe pod <pod-name>

Check logs:

kubectl logs <pod-name>

11. Kubernetes Deployment

The Deployment manages our 2048 pod.

It includes:

Docker image

CPU request

Memory request

CPU limit

Memory limit

Readiness probe

Liveness probe

Persistent storage

We used:

strategy:
  type: Recreate

We used Recreate because our EKS cluster had only one small node and could not run the old and new pods at the same time during a normal rolling update.

12. Kubernetes Service

We created a NodePort service.

type: NodePort

The service sends traffic to the Django container on:

8000

This allowed us to test the application from outside the EKS cluster.

13. ConfigMap and Secret

ConfigMap stores normal configuration:

APP_ENV
APP_NAME

Secret stores sensitive configuration values:

SECRET_KEY
DB_PASSWORD

The values used in this project are only dummy practice values.

14. Persistent Storage

We created a PersistentVolumeClaim:

game-2048-pvc

It requests:

1Gi

In EKS, the PVC uses AWS EBS storage through the AWS EBS CSI driver.

15. Minikube

Before using AWS EKS, we practiced Kubernetes locally with Minikube.

Start Minikube:

minikube start --driver=docker

Enable metrics:

minikube addons enable metrics-server

Enable storage:

minikube addons enable default-storageclass
minikube addons enable storage-provisioner

Check the cluster:

kubectl get nodes
kubectl get pods

16. Monitoring

We added monitoring using:

Metrics Server

Prometheus

Grafana

Enable Metrics Server:

minikube addons enable metrics-server

Check CPU and memory:

kubectl top pods
kubectl top nodes

Install Prometheus and Grafana:

helm install monitoring prometheus-community/kube-prometheus-stack

Access Grafana:

kubectl port-forward svc/monitoring-grafana 3000:80

Access Prometheus:

kubectl port-forward svc/monitoring-kube-prometheus-prometheus 9090:9090

What we monitor

We can check:

CPU usage

Memory usage

Pod status

Node information

Restart information

Simple difference:

Prometheus = collects metrics

Grafana = shows metrics

17. Health Checks

We added Kubernetes health checks.

Readiness Probe

It checks if the application is ready to receive traffic.

readinessProbe:
  httpGet:
    path: /
    port: 8000

Liveness Probe

It checks if the application is still alive.

livenessProbe:
  httpGet:
    path: /
    port: 8000

Simple way to remember:

Readiness = Can I send traffic to you?

Liveness = Are you still alive?

18. AWS EKS

After Minikube, we moved the Kubernetes deployment to AWS EKS.

Cluster:

2048-eks

Region:

us-east-1

Node:

t3.small

Create the cluster:

eksctl create cluster -f eks-cluster.yaml

Connect kubectl to EKS:

aws eks update-kubeconfig   --region us-east-1   --name 2048-eks

Check nodes:

kubectl get nodes

19. EBS CSI Problem

Our PVC initially did not become ready.

We found that the AWS EBS CSI driver had an AWS permission problem.

We installed the EBS CSI addon:

eksctl create addon   --cluster 2048-eks   --region us-east-1   --name aws-ebs-csi-driver   --force

We installed the EKS Pod Identity agent:

eksctl create addon   --cluster 2048-eks   --region us-east-1   --name eks-pod-identity-agent

Then we created the Pod Identity association:

eksctl create podidentityassociation   --cluster 2048-eks   --region us-east-1   --namespace kube-system   --service-account-name ebs-csi-controller-sa   --role-name AmazonEKS_EBS_CSI_DriverRole   --permission-policy-arns arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy

After this, the PVC became Bound.

20. EKS Public Testing

The application was exposed using a NodePort.

We opened the NodePort in the EC2 security group for testing.

The application was successfully opened in a browser.

This proved that:

Internet
   |
   v
AWS Node
   |
   v
NodePort
   |
   v
Kubernetes Service
   |
   v
2048 Pod

21. GitHub OIDC

For the final CI/CD setup, we did not use long-term AWS access keys in GitHub Actions.

We used GitHub OIDC.

First we checked:

aws iam list-open-id-connect-providers

Then created the GitHub OIDC provider:

aws iam create-open-id-connect-provider   --url https://token.actions.githubusercontent.com   --client-id-list sts.amazonaws.com   --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1

Then we created an IAM role:

GitHubActions-EKS-2048

This role allows GitHub Actions to access AWS for this project.

22. EKS Access for GitHub Actions

We created an EKS access entry:

aws eks create-access-entry   --cluster-name 2048-eks   --principal-arn arn:aws:iam::583664563026:role/GitHubActions-EKS-2048   --type STANDARD   --region us-east-1

Then associated the EKS policy:

aws eks associate-access-policy   --cluster-name 2048-eks   --principal-arn arn:aws:iam::583664563026:role/GitHubActions-EKS-2048   --policy-arn arn:aws:eks::aws:cluster-access-policy/AmazonEKSClusterAdminPolicy   --access-scope type=cluster   --region us-east-1

23. OIDC Problem We Faced

Initially GitHub Actions showed:

Could not assume role with OIDC
Not authorized to perform sts:AssumeRoleWithWebIdentity

The problem was the GitHub OIDC trust policy.

We corrected the trust policy and then checked it with:

aws iam get-role   --role-name GitHubActions-EKS-2048   --query 'Role.AssumeRolePolicyDocument'

After the fix, GitHub Actions was able to authenticate with AWS.

24. EKS Deployment Problem

During deployment, the new pod became:

Pending

We checked:

kubectl describe pod <pod-name>

The event showed:

Too many pods

The reason was simple:

1 small EKS node
       |
       +-- old pod
       |
       +-- new pod

The node did not have enough capacity to run both during the normal RollingUpdate.

We changed the Deployment strategy to:

strategy:
  type: Recreate

Now Kubernetes removes the old pod first and then creates the new pod.

25. Final CI/CD Flow

The final pipeline is:

Developer
   |
   | git push
   v
GitHub
   |
   v
GitHub Actions
   |
   +-- Run Django tests
   |
   +-- Build Docker image
   |
   +-- Push image to Docker Hub
   |
   +-- Login to AWS using OIDC
   |
   +-- Configure kubectl
   |
   +-- Update EKS Deployment
   |
   +-- Wait for rollout
   |
   +-- Verify pods/services
   |
   v
AWS EKS
   |
   v
2048 Application

The Docker image is tagged using the GitHub commit SHA:

om0126/2048-django-devops:${{ github.sha }}

This means each deployment can use the exact image created from that commit.

26. Useful Kubernetes Commands

Check everything:

kubectl get all

Pods:

kubectl get pods

Detailed pod information:

kubectl describe pod <pod-name>

Logs:

kubectl logs <pod-name>

CPU and memory:

kubectl top pods
kubectl top nodes

Deployments:

kubectl get deployments

Services:

kubectl get services

Storage:

kubectl get pvc

Deployment status:

kubectl rollout status deployment/2048-deployment

27. Problems We Faced

During the project we faced real problems and solved them.

Docker / Django

Django DisallowedHost

Docker container problems

Docker image build problems

Git

Remote history conflict

Push problems

Accidentally exposed Docker Hub PAT

Large Terraform provider accidentally added to Git

EC2

SSH timeout

SSH private-key error

Security Group configuration

Kubernetes

Pod Pending

Storage/PVC Pending

EBS CSI permission problem

Deployment rollout timeout

AWS EKS

EBS CSI permissions

Pod Identity setup

NodePort Security Group

GitHub OIDC authentication

GitHub Actions

AWS role assumption failure

Deployment waiting too long

Kubernetes scheduling problem

The main lesson was:

Don't guess the problem.

Check the logs.
Check the events.
Find the exact error.
Then fix that error.

28. What I Learned

Through this project I learned:

How Django applications work

Git and GitHub

Docker

Docker Hub

GitHub Actions

CI/CD

AWS EC2

Kubernetes basics

Deployments

Services

ConfigMaps

Secrets

Persistent Volumes

Minikube

Prometheus

Grafana

AWS EKS

AWS EBS

EBS CSI

IAM

GitHub OIDC

Kubernetes troubleshooting

Basic monitoring

29. Future Improvements

The project can be improved later with:

AWS Load Balancer

HTTPS

Custom domain

Auto Scaling

Better Kubernetes security

Trivy security scanning

Alerts in Grafana/Prometheus

Better application monitoring

Centralized logging

Terraform automation

Production-ready Django server

These were not required for the current learning project.

30. Final Project Status

Django                  DONE
Git/GitHub               DONE
Docker                   DONE
Docker Hub               DONE
GitHub Actions           DONE
EC2 deployment           DONE
Kubernetes               DONE
Minikube                 DONE
Persistent Storage       DONE
Prometheus               DONE
Grafana                  DONE
AWS EKS                  DONE
EBS CSI                  DONE
GitHub OIDC              DONE
Automatic EKS Deployment DONE

Final Result

This project taught me how to take a simple Django application and move it through a complete DevOps process:

Django
  ↓
GitHub
  ↓
GitHub Actions
  ↓
Docker
  ↓
Docker Hub
  ↓
Kubernetes
  ↓
AWS EKS
  ↓
Monitoring
  ↓
Grafana

The main idea of the project is:

Write code → test it → build it → deploy it → monitor it → troubleshoot it.
