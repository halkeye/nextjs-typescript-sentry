.DEFAULT_GOAL := help

dev: ## run the dev server
	node_modules/.bin/next

build: ## Build static files for server run
	rm -rf .next
	node_modules/.bin/next build

run: ## run the actual server
	node_modules/.bin/next start

.ONESHELL:
sentry: ## Upload sourcemaps to sentry
	export SENTRY_ORG=gavin-mogan
	export SENTRY_PROJECT=nextjs-typescript-sentry
	cd .next;
	../node_modules/.bin/sentry-cli releases files $(shell cat .next/BUILD_ID) upload-sourcemaps "--url-prefix=$(shell pwd)/.next" --rewrite .
	../node_modules/.bin/sentry-cli releases finalize $(shell cat .next/BUILD_ID)

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
