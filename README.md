# nextjs-typescript-sentry

## How to setup

* Export SENTRY_AUTH_TOKEN env variable, set to an auth token created https://sentry.io/settings/account/api/auth-tokens/ with project:releases permission
* $ make build sentry run


## Warning

* Pretty picky tsconfig.json, based on actual use. If you delete it, nextjs will create a new default one that is a lot more relaxed, you just need to set "sourceMap": true in tsconfig.json
