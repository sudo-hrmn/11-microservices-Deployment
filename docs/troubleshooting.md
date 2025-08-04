# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### 1. Pods Not Starting

#### Issue: Pods stuck in `Pending` state
```bash
# Check pod status
kubectl get pods

# Describe pod for more details
kubectl describe pod <pod-name>
```

**Common Causes:**
- Insufficient cluster resources
- Image pull failures
- Node selector constraints

**Solutions:**
```bash
# Check cluster resources
kubectl top nodes
kubectl describe nodes

# Check if images are available
docker pull gcr.io/google-samples/microservices-demo/frontend:v0.8.0

# Increase cluster resources
minikube start --memory=6144 --cpus=6
```

#### Issue: Pods stuck in `ImagePullBackOff`
```bash
# Check pod events
kubectl describe pod <pod-name>
```

**Solutions:**
```bash
# Check if Docker daemon is running
sudo systemctl status docker

# Pull images manually
docker pull gcr.io/google-samples/microservices-demo/frontend:v0.8.0

# Check network connectivity
ping gcr.io
```

### 2. Service Connection Issues

#### Issue: Services not accessible
```bash
# Check service status
kubectl get services

# Check endpoints
kubectl get endpoints
```

**Solutions:**
```bash
# Port forward for testing
kubectl port-forward service/frontend 8080:80

# Check if pods are ready
kubectl get pods -l app=frontend

# Test service connectivity from within cluster
kubectl run test-pod --image=busybox --rm -it -- wget -qO- http://frontend:80
```

#### Issue: External access not working
```bash
# For minikube, use service command
minikube service frontend-external --url

# Check if LoadBalancer is supported
kubectl get services frontend-external
```

### 3. Application Errors

#### Issue: 500 Internal Server Error
```bash
# Check application logs
kubectl logs deployment/frontend

# Check all related services
kubectl logs deployment/productcatalogservice
kubectl logs deployment/cartservice
```

**Common Causes:**
- Backend services not ready
- Database connection issues
- Configuration errors

**Solutions:**
```bash
# Wait for all services to be ready
kubectl wait --for=condition=ready pod --all --timeout=300s

# Check Redis connectivity
kubectl logs deployment/cartservice | grep -i redis

# Restart problematic services
kubectl rollout restart deployment/cartservice
```

#### Issue: gRPC connection failures
```bash
# Check service discovery
kubectl get services
kubectl get endpoints

# Test gRPC connectivity
kubectl exec -it <frontend-pod> -- nc -zv productcatalogservice 3550
```

### 4. Performance Issues

#### Issue: Slow response times
```bash
# Check resource usage
kubectl top pods
kubectl top nodes

# Check for resource limits
kubectl describe pod <pod-name> | grep -A 5 Limits
```

**Solutions:**
```bash
# Increase resource limits
kubectl patch deployment frontend -p '{"spec":{"template":{"spec":{"containers":[{"name":"server","resources":{"limits":{"cpu":"500m","memory":"256Mi"}}}]}}}}'

# Scale up replicas
kubectl scale deployment frontend --replicas=3

# Enable horizontal pod autoscaling
kubectl autoscale deployment frontend --cpu-percent=50 --min=1 --max=10
```

#### Issue: High memory usage
```bash
# Monitor memory usage
kubectl top pods --sort-by=memory

# Check for memory leaks in logs
kubectl logs deployment/frontend | grep -i "memory\|oom"
```

### 5. Networking Issues

#### Issue: DNS resolution failures
```bash
# Test DNS from within a pod
kubectl run test-pod --image=busybox --rm -it -- nslookup kubernetes.default

# Check CoreDNS status
kubectl get pods -n kube-system -l k8s-app=kube-dns
```

**Solutions:**
```bash
# Restart CoreDNS
kubectl rollout restart deployment/coredns -n kube-system

# Check DNS configuration
kubectl get configmap coredns -n kube-system -o yaml
```

#### Issue: Network policies blocking traffic
```bash
# Check network policies
kubectl get networkpolicies

# Test connectivity between pods
kubectl exec -it <source-pod> -- nc -zv <target-service> <port>
```

### 6. Storage Issues

#### Issue: Redis connection failures
```bash
# Check Redis pod status
kubectl get pods -l app=redis-cart

# Check Redis logs
kubectl logs deployment/redis-cart
```

**Solutions:**
```bash
# Restart Redis
kubectl rollout restart deployment/redis-cart

# Check Redis configuration
kubectl describe deployment redis-cart

# Test Redis connectivity
kubectl exec -it deployment/redis-cart -- redis-cli ping
```

### 7. Minikube Specific Issues

#### Issue: Minikube won't start
```bash
# Check minikube status
minikube status

# Check available drivers
minikube start --help | grep driver
```

**Solutions:**
```bash
# Delete and recreate cluster
minikube delete
minikube start --driver=docker --memory=4096 --cpus=4

# Use different driver if Docker fails
minikube start --driver=virtualbox --memory=4096 --cpus=4

# Check system resources
free -h
df -h
```

#### Issue: VirtualBox conflicts
```bash
# Error: VirtualBox can't enable AMD-V extension
```

**Solutions:**
```bash
# Use Docker driver instead
minikube delete
minikube start --driver=docker

# Or disable KVM if using VirtualBox
sudo modprobe -r kvm_amd  # For AMD
sudo modprobe -r kvm_intel  # For Intel
```

## Debugging Commands

### Essential Debugging Commands
```bash
# Get all resources
kubectl get all

# Describe resources for detailed info
kubectl describe pod <pod-name>
kubectl describe service <service-name>
kubectl describe deployment <deployment-name>

# Check logs
kubectl logs <pod-name>
kubectl logs -f deployment/<deployment-name>
kubectl logs --previous <pod-name>  # Previous container logs

# Execute commands in pods
kubectl exec -it <pod-name> -- /bin/bash
kubectl exec -it <pod-name> -- sh

# Port forwarding for debugging
kubectl port-forward pod/<pod-name> 8080:8080
kubectl port-forward service/<service-name> 8080:80

# Check events
kubectl get events --sort-by=.metadata.creationTimestamp

# Resource usage
kubectl top pods
kubectl top nodes
```

### Network Debugging
```bash
# Test connectivity from within cluster
kubectl run debug-pod --image=busybox --rm -it -- sh

# Inside the debug pod:
wget -qO- http://frontend:80
nc -zv productcatalogservice 3550
nslookup frontend
```

### Application Debugging
```bash
# Check application health endpoints
kubectl exec -it <frontend-pod> -- curl http://localhost:8080/health

# Check environment variables
kubectl exec -it <pod-name> -- env

# Check mounted volumes
kubectl exec -it <pod-name> -- df -h
```

## Monitoring and Alerting

### Basic Monitoring
```bash
# Watch pod status
kubectl get pods --watch

# Monitor resource usage
watch kubectl top pods

# Check cluster health
kubectl get componentstatuses
```

### Log Analysis
```bash
# Search for errors in logs
kubectl logs deployment/frontend | grep -i error

# Get logs from all pods with label
kubectl logs -l app=frontend --tail=100

# Export logs for analysis
kubectl logs deployment/frontend > frontend.log
```

## Recovery Procedures

### Service Recovery
```bash
# Restart deployment
kubectl rollout restart deployment/<deployment-name>

# Scale down and up
kubectl scale deployment <deployment-name> --replicas=0
kubectl scale deployment <deployment-name> --replicas=1

# Delete and recreate pods
kubectl delete pod <pod-name>
```

### Complete Application Reset
```bash
# Delete all application resources
kubectl delete -f ./kubernetes-manifests/

# Wait for cleanup
kubectl get pods

# Redeploy
kubectl apply -f ./kubernetes-manifests/
```

### Cluster Recovery
```bash
# Reset minikube cluster
minikube delete
minikube start --driver=docker --memory=4096 --cpus=4

# Redeploy application
kubectl apply -f ./kubernetes-manifests/
```

## Getting Help

### Useful Resources
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Minikube Documentation](https://minikube.sigs.k8s.io/docs/)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)

### Community Support
- [Kubernetes Slack](https://kubernetes.slack.com/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/kubernetes)
- [GitHub Issues](https://github.com/sudo-hrmn/11-microservices-Deployment/issues)

### Professional Support
For production deployments, consider:
- Google Cloud Support (for GKE)
- AWS Support (for EKS)
- Azure Support (for AKS)
- Red Hat OpenShift Support
