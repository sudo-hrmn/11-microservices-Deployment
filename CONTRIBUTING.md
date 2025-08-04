# Contributing to Online Boutique Microservices

Thank you for your interest in contributing to this project! This guide will help you get started.

## 🎯 Project Overview

This project demonstrates a production-ready microservices architecture using Google's Online Boutique application. It's designed to showcase DevOps best practices, cloud-native development, and Kubernetes orchestration.

## 🚀 Getting Started

### Prerequisites
- Docker
- Kubernetes (Minikube recommended for local development)
- kubectl
- Git

### Setting Up Development Environment

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/11-microservices-Deployment.git
   cd 11-microservices-Deployment
   ```

2. **Set up local cluster**
   ```bash
   minikube start --driver=docker --memory=4096 --cpus=4
   ```

3. **Deploy the application**
   ```bash
   kubectl apply -f ./kubernetes-manifests/
   ```

## 🤝 How to Contribute

### Types of Contributions Welcome

1. **Documentation Improvements**
   - Fix typos or unclear instructions
   - Add examples or use cases
   - Improve deployment guides

2. **Infrastructure Enhancements**
   - Kubernetes manifest optimizations
   - Helm chart improvements
   - CI/CD pipeline enhancements

3. **Monitoring & Observability**
   - Prometheus metrics
   - Grafana dashboards
   - Logging improvements

4. **Security Enhancements**
   - Network policies
   - RBAC configurations
   - Security scanning

5. **Performance Optimizations**
   - Resource limit tuning
   - Caching strategies
   - Load balancing improvements

### Contribution Process

1. **Create an Issue**
   - Describe the problem or enhancement
   - Provide context and use cases
   - Wait for discussion and approval

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**
   - Follow coding standards
   - Test your changes locally
   - Update documentation if needed

4. **Test Your Changes**
   ```bash
   # Deploy and test
   kubectl apply -f ./kubernetes-manifests/
   kubectl wait --for=condition=ready pod --all --timeout=300s
   
   # Verify functionality
   ./scripts/access-app.sh
   ```

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add description of your changes"
   ```

6. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a Pull Request on GitHub.

## 📝 Coding Standards

### Kubernetes Manifests
- Use consistent indentation (2 spaces)
- Include resource limits and requests
- Add appropriate labels and annotations
- Follow Kubernetes best practices

### Documentation
- Use clear, concise language
- Include code examples where helpful
- Update table of contents if needed
- Test all commands and procedures

### Commit Messages
Follow conventional commit format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `refactor:` for code refactoring
- `test:` for test additions/changes

## 🧪 Testing Guidelines

### Local Testing
1. **Deploy locally**
   ```bash
   kubectl apply -f ./kubernetes-manifests/
   ```

2. **Verify all pods are running**
   ```bash
   kubectl get pods
   ```

3. **Test application functionality**
   ```bash
   # Access the application
   minikube service frontend-external --url
   
   # Test key features
   # - Browse products
   # - Add to cart
   # - Checkout process
   ```

4. **Check logs for errors**
   ```bash
   kubectl logs deployment/frontend
   ```

### Performance Testing
- Ensure changes don't negatively impact performance
- Test with load generator if applicable
- Monitor resource usage

## 📋 Pull Request Guidelines

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Other (please describe)

## Testing
- [ ] Tested locally with minikube
- [ ] All pods start successfully
- [ ] Application is accessible
- [ ] No errors in logs

## Checklist
- [ ] Code follows project standards
- [ ] Documentation updated if needed
- [ ] Commit messages follow convention
- [ ] Changes are backwards compatible
```

### Review Process
1. Automated checks must pass
2. At least one maintainer review required
3. All discussions must be resolved
4. Changes must be tested locally

## 🐛 Reporting Issues

### Bug Reports
Include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Kubernetes version, etc.)
- Relevant logs or error messages

### Feature Requests
Include:
- Clear description of the feature
- Use case and benefits
- Proposed implementation approach
- Any relevant examples or references

## 📚 Resources

### Learning Resources
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Microservices Patterns](https://microservices.io/patterns/)

### Project Resources
- [Architecture Documentation](./docs/ARCHITECTURE.md)
- [Deployment Guide](./docs/deployment-guide.md)
- [Troubleshooting Guide](./docs/troubleshooting.md)

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- LinkedIn posts highlighting community contributions

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussion
- **LinkedIn**: Connect with the maintainer for professional networking

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project (Apache 2.0).

---

Thank you for contributing to the Online Boutique Microservices project! 🎉
