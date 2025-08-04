# 🚀 Deployment Guide

## Prerequisites

### System Requirements
- **Docker**: Version 20.10 or higher
- **Kubernetes**: Minikube, Kind, or any Kubernetes cluster
- **kubectl**: Kubernetes command-line tool
- **Memory**: At least 4GB RAM available for the cluster
- **CPU**: At least 2 CPU cores

### Installation

#### Install Docker
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install docker.io
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo usermod -aG docker $USER
```

#### Install Minikube
```bash
# Download and install minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
```

#### Install kubectl
```bash
# Download kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

## Deployment Steps

### 1. Start Kubernetes Cluster

```bash
# Start minikube with sufficient resources
minikube start --driver=docker --memory=4096 --cpus=4

# Verify cluster is running
kubectl cluster-info
```

### 2. Deploy the Application

```bash
# Clone the repository
git clone https://github.com/sudo-hrmn/11-microservices-Deployment.git
cd 11-microservices-Deployment

# Deploy all services
kubectl apply -f ./kubernetes-manifests/

# Wait for all pods to be ready
kubectl wait --for=condition=ready pod --all --timeout=300s
```

### 3. Verify Deployment

```bash
# Check pod status
kubectl get pods

# Check services
kubectl get services

# Check deployments
kubectl get deployments
```

### 4. Access the Application

```bash
# Get the frontend service URL
minikube service frontend-external --url

# Or use the provided script
./scripts/access-app.sh
```

## Configuration Options

### Resource Limits

You can modify resource limits in the Kubernetes manifests:

```yaml
resources:
  requests:
    cpu: 100m
    memory: 64Mi
  limits:
    cpu: 200m
    memory: 128Mi
```

### Scaling Services

```bash
# Scale frontend service
kubectl scale deployment frontend --replicas=3

# Enable auto-scaling
kubectl autoscale deployment frontend --cpu-percent=50 --min=1 --max=10
```

### Environment Variables

Modify environment variables in the deployment manifests:

```yaml
env:
- name: PORT
  value: "8080"
- name: DISABLE_TRACING
  value: "1"
```

## Troubleshooting

### Common Issues

#### Pods Not Starting
```bash
# Check pod logs
kubectl logs <pod-name>

# Describe pod for events
kubectl describe pod <pod-name>
```

#### Service Not Accessible
```bash
# Check service endpoints
kubectl get endpoints

# Port forward for debugging
kubectl port-forward service/frontend 8080:80
```

#### Resource Issues
```bash
# Check resource usage
kubectl top pods
kubectl top nodes

# Check cluster resources
kubectl describe nodes
```

### Cleanup

```bash
# Delete all resources
kubectl delete -f ./kubernetes-manifests/

# Stop minikube
minikube stop

# Delete minikube cluster
minikube delete
```

## Production Deployment

### Cloud Platforms

#### Google Kubernetes Engine (GKE)
```bash
# Create GKE cluster
gcloud container clusters create online-boutique \
  --num-nodes=3 \
  --machine-type=e2-standard-2

# Deploy application
kubectl apply -f ./kubernetes-manifests/
```

#### Amazon EKS
```bash
# Create EKS cluster
eksctl create cluster --name online-boutique --nodes 3

# Deploy application
kubectl apply -f ./kubernetes-manifests/
```

#### Azure AKS
```bash
# Create AKS cluster
az aks create --resource-group myResourceGroup \
  --name online-boutique --node-count 3

# Deploy application
kubectl apply -f ./kubernetes-manifests/
```

## Monitoring and Observability

### Health Checks
```bash
# Check application health
curl http://<frontend-url>/health

# Monitor pod health
kubectl get pods --watch
```

### Logs
```bash
# View logs from all pods
kubectl logs -l app=frontend

# Stream logs
kubectl logs -f deployment/frontend
```

### Metrics
```bash
# Enable metrics server (if not already enabled)
minikube addons enable metrics-server

# View resource usage
kubectl top pods
kubectl top nodes
```

## Security Considerations

### Network Policies
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: frontend-netpol
spec:
  podSelector:
    matchLabels:
      app: frontend
  policyTypes:
  - Ingress
  ingress:
  - from: []
    ports:
    - protocol: TCP
      port: 8080
```

### RBAC
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-reader
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "watch", "list"]
```

## Performance Tuning

### Resource Optimization
- Adjust CPU and memory requests/limits based on actual usage
- Use horizontal pod autoscaling for dynamic scaling
- Implement resource quotas for namespace-level limits

### Database Optimization
- Configure Redis persistence for cart data
- Implement connection pooling
- Use Redis clustering for high availability

### Network Optimization
- Use service mesh (Istio) for advanced traffic management
- Implement circuit breakers for fault tolerance
- Configure load balancing algorithms
