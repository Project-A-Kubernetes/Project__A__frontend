Project A - Kubernetes Frontend

This repository contains the frontend application for Project A, with a production-ready CI/CD pipeline that includes integration testing, SonarCloud code analysis, security scanning with Trivy, and automated Docker image build/push to AWS ECR.

Table of Contents

Project Overview

Prerequisites

Local Setup

CI/CD Workflow

Docker & Integration Testing

SonarCloud Code Analysis

Security Scanning with Trivy

Contributing

License

Project Overview

Project A is a frontend application built for Kubernetes deployment. The project is configured for robust CI/CD with GitHub Actions pipelines to ensure:

Code quality and maintainability (SonarCloud)

Security scanning for Docker images (Trivy)

Automated testing of Docker images (integration tests)

Automated production-ready Docker builds and pushes to AWS ECR

Prerequisites

Docker
 installed locally

AWS CLI
 configured

GitHub Actions secrets configured for:

AWS_REGION

AWS_ROLE

ECR_REPO

SONAR_TOKEN
Local Setup

Clone the repository:

git clone https://github.com/Project-A-Kubernetes/Project__A__frontend.git
cd Project-A-Kubernetes/Project__A__frontend

CI/CD Workflow

The project uses GitHub Actions to orchestrate CI/CD:

SonarCloud Scan

Runs on PRs and push to main

Checks code quality, test coverage, and potential bugs

Docker Build & Integration Tests

Runs on push to main

Builds a Docker image

Runs integration tests against the container

If successful, pushes the image to AWS ECR

Security Scan (Trivy)

Runs after Docker image build

Scans images for critical/high vulnerabilities