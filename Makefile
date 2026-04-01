SHELL := /usr/bin/env bash
.DEFAULT_GOAL := help

ENV ?= dev
SERVICE ?=
TAG ?=
LOCAL_PORT ?=
TAIL ?= 200
NAMESPACE ?=
BUILD ?= 0

.PHONY: help services build up down logs port-forward template status pods svc

help: ## Show commands and flags
	@echo ""
	@echo "Marketplace deploy commands"
	@echo ""
	@echo "Usage:"
	@echo "  make <target> [ENV=dev] [SERVICE=name] [TAG=latest] [LOCAL_PORT=8090] [TAIL=200] [BUILD=0]"
	@echo ""
	@echo "Targets:"
	@awk 'BEGIN {FS = ":.*## "}; /^[a-zA-Z0-9_.-]+:.*## / { printf "  %-14s %s\n", $$1, $$2 }' $(MAKEFILE_LIST)
	@echo ""
	@echo "Flags:"
	@echo "  ENV        Values overlay name. Default: dev"
	@echo "  SERVICE    Target service name. Omit to affect all enabled services"
	@echo "  TAG        Image tag override. Default from values.yaml"
	@echo "  LOCAL_PORT Local port for port-forward"
	@echo "  TAIL       Number of lines for logs. Default: 200"
	@echo "  BUILD      For 'up': if BUILD=1, build images before deploy"
	@echo ""

services: ## List services from values and their main settings
	@ENV=$(ENV) ./scripts/services.sh

build: ## Build one service or all enabled services and load images into minikube
	@ENV=$(ENV) SERVICE=$(SERVICE) TAG=$(TAG) ./scripts/build.sh

up: ## Deploy one service or all enabled services; same command also works as restart
	@ENV=$(ENV) SERVICE=$(SERVICE) TAG=$(TAG) BUILD=$(BUILD) NAMESPACE=$(NAMESPACE) ./scripts/up.sh

down: ## Disable one service or uninstall the whole release
	@ENV=$(ENV) SERVICE=$(SERVICE) TAG=$(TAG) NAMESPACE=$(NAMESPACE) ./scripts/down.sh

logs: ## Show logs for one service deployment
	@test -n "$(SERVICE)" || (echo "SERVICE is required"; exit 1)
	@ENV=$(ENV) SERVICE=$(SERVICE) TAIL=$(TAIL) NAMESPACE=$(NAMESPACE) ./scripts/logs.sh

port-forward: ## Forward localhost:LOCAL_PORT to service port
	@test -n "$(SERVICE)" || (echo "SERVICE is required"; exit 1)
	@ENV=$(ENV) SERVICE=$(SERVICE) LOCAL_PORT=$(LOCAL_PORT) NAMESPACE=$(NAMESPACE) ./scripts/port-forward.sh

template: ## Render Helm manifests locally
	@ENV=$(ENV) TAG=$(TAG) NAMESPACE=$(NAMESPACE) ./scripts/template.sh

status: ## Show Helm release status
	@./scripts/status.sh $(ENV) $(NAMESPACE)

pods: ## Show pods in namespace
	@./scripts/pods.sh $(ENV) $(NAMESPACE)

svc: ## Show services in namespace
	@./scripts/svc.sh $(ENV) $(NAMESPACE)
