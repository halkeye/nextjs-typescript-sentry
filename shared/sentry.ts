// Based on https://github.com/zeit/next.js/tree/canary/examples/with-sentry
// NOTE: This require will be replaced with `@sentry/browser`
// client side thanks to the webpack config in next.config.js
import * as Sentry from '@sentry/node'
import Cookie from 'js-cookie'

const sentryOptions = {
  release: process.env.SENTRY_RELEASE,
  dsn: process.env.SENTRY_DSN,
  maxBreadcrumbs: 50,
  attachStacktrace: true,
  transport: null,
  integrations: []
}

// When we're developing locally
if (process.env.NODE_ENV !== 'production') {
  // disabling all the eslint rules to allow this to only be loaded in dev environment
  // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires, import/no-extraneous-dependencies
  const sentryTestkit = require('sentry-testkit')
  // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires, import/no-extraneous-dependencies
  const SentryIntegrations = require('@sentry/integrations')
  const {sentryTransport} = sentryTestkit()

  // Don't actually send the errors to Sentry
  sentryOptions.transport = sentryTransport

  // Instead, dump the errors to the console
  sentryOptions.integrations = [
    new SentryIntegrations.Debug({
      // Trigger DevTools debugger instead of using console.log
      debugger: false
    })
  ]
}

Sentry.init(sentryOptions)

const configureScope = (scope, ctx?): void => {
  if (ctx) {
    const {
      req, res, errorInfo, query, pathname
    } = ctx

    if (res && res.statusCode) {
      scope.setExtra('statusCode', res.statusCode)
    }

    if (typeof window !== 'undefined') {
      scope.setTag('ssr', 'false')
      scope.setExtra('query', query)
      scope.setExtra('pathname', pathname)

      // On client-side we use js-cookie package to fetch it
      const sessionId = Cookie.get('sid')
      if (sessionId) {
        scope.setUser({ id: sessionId })
      }
    } else {
      scope.setTag('ssr', 'true')
      scope.setExtra('url', req.url)
      scope.setExtra('method', req.method)
      scope.setExtra('headers', req.headers)
      scope.setExtra('params', req.params)
      scope.setExtra('query', req.query)

      // FIXME - Add setUser when auth support ssr, unhack this
      // next doens't seem to process cookies except for api request, so if its not processed, then process it
      if (req.cookies && req.cookies.sid) {
        scope.setUser({ id: req.cookies.sid })
      } else if (req.headers.cookie) {
        const sidCookie = req.headers.cookie.split(';').map((cookie): string[] => cookie.trim().split('=', 2)).find((cookie): boolean => cookie[0] === 'sid')
        if (sidCookie) {
          scope.setUser({ id: sidCookie[1] })
        }
      }
    }

    if (errorInfo) {
      Object.keys(errorInfo).forEach((key): void => {
        scope.setExtra(key, errorInfo[key])
      })
    }
  }
}

const captureMessage = (msg, ctx?): string | undefined => {
  Sentry.configureScope((scope): void => {
    configureScope(scope, ctx)
  })

  return Sentry.captureMessage(msg)
}
const captureException = (err, ctx): string | undefined => {
  Sentry.configureScope((scope): void => {
    if (err.message) {
      // De-duplication currently doesn't work correctly for SSR / browser errors
      // so we force deduplication by error message if it is present
      scope.setFingerprint([err.message])
    }

    if (err.statusCode) {
      scope.setExtra('statusCode', err.statusCode)
    }
    configureScope(scope, ctx)
  })

  if ('isAxiosError' in err) {
    return Sentry.captureException((err).toJSON())
  }

  return Sentry.captureException(err)
}

export {captureException, captureMessage}
