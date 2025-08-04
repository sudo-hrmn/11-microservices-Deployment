#!/bin/bash

echo "==================================="
echo "Online Boutique - Microservices Demo"
echo "==================================="
echo ""
echo "Checking if minikube is running..."
if ! minikube status > /dev/null 2>&1; then
    echo "Starting minikube..."
    minikube start --driver=docker --memory=4096 --cpus=4
fi

echo ""
echo "Getting application URL..."
URL=$(minikube service frontend-external --url)
echo ""
echo "🎉 Online Boutique is accessible at:"
echo "   $URL"
echo ""
echo "📱 Open this URL in your browser to access the application"
echo ""
echo "To stop the application:"
echo "   kubectl delete -f ./release/kubernetes-manifests.yaml"
echo "   minikube stop"
echo ""
