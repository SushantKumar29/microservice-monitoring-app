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
├── submitter/                 # Service A - Job Submitter
│   ├── src/
│   │   ├── config/           # Redis config
│   │   ├── controllers/      # API handlers
│   │   ├── routes/           # Express routes
│   │   ├── utils/            # Logger, metrics
│   │   └── ...
│   ├── tests/                # Unit tests
│   └── package.json
│
├── worker/                    # Service B - Worker (Scalable)
│   ├── src/
│   │   ├── config/           # Redis config
│   │   ├── controllers/      # Worker loop, job processing
│   │   ├── routes/           # Stats endpoints
│   │   ├── services/         # Prime calculator
│   │   ├── utils/            # Logger, metrics
│   │   └── ...
│   ├── tests/                # Unit tests
│   └── package.json
│
├── stats/                     # Service C - Stats Aggregator
│   ├── src/
│   │   ├── config/           # Redis config
│   │   ├── controllers/      # API handlers
│   │   ├── routes/           # Stats endpoints
│   │   ├── services/         # Prime calculator
│   │   ├── utils/            # Logger, metrics
│   │   └── ...
│   ├── tests/                # Unit tests
│   └── package.json
│
├── k8s-yamls/                 # Kubernetes manifests
│   ├── redis/             # Redis deployment & service
│   ├── apps/              # App deployments & services
│   ├── autoscaling/       # HPA configuration
│   ├── ingress/           # Ingress rules
│   └── monitoring/        # ServiceMonitor, Grafana dashboards
│

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

1. Build Docker Images

```
# Build each service

cd submitter && docker build -t job-submitter . && cd ..
cd worker && docker build -t job-worker . && cd ..
cd stats && docker build -t job-stats . && cd ..

# Load into Minikube

minikube image load job-submitter
minikube image load job-worker
minikube image load job-stats
```

2. Install Prometheus Stack

```
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack
```

3. Deploy Application

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

4. Access the application

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
kubectl port-forward svc/prometheus-grafana 3000:80
# Open: http://localhost:3000
# Login: admin / admin
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
