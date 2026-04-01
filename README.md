# Marketplace deploy overlay

This package contains the final deploy layer for the marketplace project:

- `deploy/helm/marketplace` — Helm chart
- `scripts/` — generic helper scripts
- `Makefile` — unified commands with `make help`

Main flow for minikube:

```bash
minikube start
make build          # build all enabled services and load images into minikube
make up             # deploy all enabled services
make logs SERVICE=goods
make port-forward SERVICE=goods LOCAL_PORT=8090
make down SERVICE=gateway
make down           # remove whole release
```

Notes:
- Images are loaded directly into minikube.
- Default registry is empty for local dev.
- `make up SERVICE=<name>` enables/redeploys one service and uses the same command as restart.
- `make build SERVICE=<name>` builds one service. Without `SERVICE`, it builds all enabled services.
