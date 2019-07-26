import * as React from 'react'
import App, {Container, AppInitialProps} from 'next/app'
import Router from 'next/router'
import {captureException} from '../shared/sentry'

export default class AppPage extends App {
  static async getInitialProps({Component, ctx}): Promise<AppInitialProps> {
    try {
      let pageProps = {}

      if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx)
      }

      return {
        pageProps
      }
    } catch (err) {
      captureException(err, ctx)
      throw err
    }
  }

  componentDidCatch(err: Error, errorInfo: React.ErrorInfo): void {
    captureException(err, null)
    super.componentDidCatch(err, errorInfo)
  }

  render(): React.ReactElement {
    const {Component, pageProps} = this.props
    return <Component {...pageProps} />;
  }
}
