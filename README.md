# Microservices Monitoring System

## Project Overview

A Kubernetes-based microservices system that processes CPU-intensive jobs using a queue-based worker model with auto-scaling and monitoring.

## Tech Stack

| Component     | Technology                 |
| ------------- | -------------------------- |
| Runtime       | Node.js (ES Modules)       |
| Language      | TypeScript                 |
| Queue         | Redis                      |
| API           | Express.js                 |
| Metrics       | prom-client                |
| Logging       | Winston                    |
| Testing       | Jest, Supertest            |
| Container     | Docker                     |
| Orchestration | Kubernetes (Minikube/Kind) |
| Auto-scaling  | HPA (Metrics Server)       |
| Monitoring    | Prometheus                 |
| Visualization | Grafana                    |

## Folder Structure

```
microservice-monitoring-app/
├── k8s-yamls/              # Kubernetes deployment files
│   ├── apps/               # Service deployments (submitter, worker, stats)
│   ├── autoscaling/        # HPA config for worker scaling
│   ├── ingress/            # External access config
│   ├── monitoring/         # Prometheus & Grafana configs
│   └── redis/              # Redis deployment
├── public/                 # Static assets
│   └── assets/
│       └── screenshots/    # Grafana dashboard screenshots
├── shared/                 # Shared code used by all services
│   ├── package.json
│   ├── src/
│   │   ├── config/         # Redis connection
│   │   ├── constants/      # Shared constants (QUEUE_NAME, METRICS, etc.)
│   │   ├── index.ts        # Main export file
│   │   └── utils/          # Logger, helpers
│   ├── tsconfig.base.json  # Base TypeScript config
│   └── tsconfig.json
├── stats/                  # Service C - Shows job stats & metrics
│   ├── Dockerfile
│   ├── package.json
│   ├── src/
│   │   ├── controllers/    # /stats, /health, /metrics endpoints
│   │   ├── index.ts        # Entry point (port 3002)
│   │   ├── routes/
│   │   ├── services/       # Stats calculation logic
│   │   ├── types.ts
│   │   └── utils/          # Prometheus metrics
│   ├── tests/
│   └── tsconfig.json
├── submitter/              # Service A - Receives job requests
│   ├── Dockerfile
│   ├── package.json
│   ├── src/
│   │   ├── controllers/    # /submit, /status/:id, /health
│   │   ├── index.ts        # Entry point (port 3000)
│   │   └── routes/
│   ├── tests/
│   └── tsconfig.json
├── worker/                 # Service B - Processes jobs (scales with HPA)
|   ├── Dockerfile
|   ├── package.json
|   ├── src/
|   │   ├── controllers/    # Job processing loop, /health, /metrics
|   │   ├── index.ts        # Entry point (port 3001)
|   │   ├── routes/
|   │   ├── services/       # CPU-intensive tasks (primes, hashing, sorting)
|   │   ├── types.ts
|   │   └── utils/          # Prometheus metrics
|   ├── tests/
|   └── tsconfig.json
├── package.json            # Root workspace config
├── package-lock.json
└── README.md
```

## Setup & Deployment

### Prerequisites

```
# Install Minikube (or Kind)

install minikube

# Start cluster

minikube start

# Enable addons

minikube addons enable ingress
minikube addons enable metrics-server

# Install Helm

install helm
```

1. Clone Repo

```
git clone https://github.com/SushantKumar29/microservice-monitoring-app.git
```

2. Install packages

```
npm install
```

3. Build Docker Images

```
# Build each service (from root) and load to minikube
cd path/microservice-monitoring-app

docker build -f worker/Dockerfile -t job-worker .
docker build -f submitter/Dockerfile -t job-submitter .
docker build -f stats/Dockerfile -t job-stats .

# Load into Minikube

minikube image load job-submitter
minikube image load job-worker
minikube image load job-stats
```

4. Install Prometheus Stack

```
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack
```

5. Deploy Application

```
# Deploy in order
kubectl apply -f k8s-yamls/redis/
kubectl apply -f k8s-yamls/apps/
kubectl apply -f k8s-yamls/autoscaling/
kubectl apply -f k8s-yamls/ingress/
kubectl apply -f k8s-yamls/monitoring/

# Verify deployments
kubectl get pods
kubectl get svc
kubectl get hpa
```

6. Access the application

```
# Get the URL (Minikube)
minikube service submitter-service --url
```

## API Endpoints

```
/submit ---------- POST # Submit a new job
/status/:id ------ GET # Check job status
/stats ----------- GET # Get system statistics
/metrics --------- GET # Prometheus metrics (Worker/Stats)
```

## Test with curl

```
# Submit a job
curl -X POST http://<submitter-url>/submit

# Check status
curl http://<submitter-url>/status/{jobId}

# Get stats
curl http://<submitter-url>/stats
```

## Stress Testing & Auto-scaling

```
# Create POST data file (As the submit is a POST request)
echo "{}" > data.json

# Run 5000 requests with 200 concurrent
ab -n 5000 -c 200 -p data.json -T application/json http://<submitter-url>/submit
```

## Watch Auto-scaling in Action

```
# Terminal 1 - Watch HPA
kubectl get hpa -w

# Terminal 2 - Watch Pods
kubectl get pods -w | grep worker

# Terminal 3 - Watch CPU
watch -n 1 kubectl top pods

# Terminal 4 - Run stress test
ab -n 5000 -c 200 -p data.json -T application/json http://<submitter-url>/submit
```

## Monitoring with Grafana

```
# Run Prometheus
kubectl port-forward svc/prometheus-kube-prometheus-prometheus 9090:9090

# Run Grafana
kubectl port-forward svc/prometheus-grafana 3000:80

# Open: http://localhost:3000

Login Grafana (admin / get password): kubectl get secret prometheus-grafana -o jsonpath="{.data.admin-password}" | base64 -d
OR
Use default login credentials (admin / admin)
```

## Screenshots

<details>
<summary><b> Click to view all screenshots</b></summary>

### Total Jobs Submitted

<img src="/public/assets/screenshots/total_jobs_submitted.png" alt="Total Jobs Submitted" width="800"/>

### Total Jobs Completed

<img src="/public/assets/screenshots/total_jobs_completed.png" alt="Total Jobs Completed" width="800"/>

### Jobs Submission Rate (1m)

<img src="/public/assets/screenshots/jobs_submitted_rate.png" alt="Jobs Submission Rate (1m)" width="800"/>

### Jobs Processing Duration

<img src="/public/assets/screenshots/job_processing_duration.png" alt="Jobs Processing Duration" width="800"/>

### CPU Usage

<img src="/public/assets/screenshots/worker_cpu_usage.png" alt="CPU Usage" width="800"/>

### Queue Length

<img src="/public/assets/screenshots/queue_length.png" alt="Queue Length" width="800"/>

### Active Replicas

<img src="/public/assets/screenshots/active_replicas.png" alt="Active Replicas" width="800"/>

### Worker Scalling

<img src="/public/assets/screenshots/worker_scaling_1.png" alt="Worker Scalling 1" width="800"/>

<img src="/public/assets/screenshots/worker_scaling_2.png" alt="Worker Scalling 2" width="800"/>

</details>

## Running Tests

```
# Run all tests
npm run test

# Run specific service tests
npm run test:submitter
npm run test:worker
npm run test:stats
```

## License

Copyright (c) 2026 Sushant Kumar.

Permission is hereby granted, free of charge, to any person obtaining a copy
