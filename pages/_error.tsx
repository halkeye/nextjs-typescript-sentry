import * as React from 'react'
import Error from 'next/error'
import {captureException} from '../shared/sentry'

const getStatusCode = ({res, err}): number => {
  if (res) {
    return res.statusCode
  }
  if (err) {
    return err.statusCode
  }

  return null
}

interface IErrorProps {
  statusCode: number
}

class ErrorPage extends React.Component<IErrorProps> {
  static getInitialProps(ctx): IErrorProps {
    const statusCode = getStatusCode(ctx)
    if (ctx.err) {
      captureException(ctx.err, ctx)
    }

    return {statusCode}
  }

  render(): React.ReactElement {
    const {statusCode} = this.props
    if (statusCode) {
      return <Error statusCode={statusCode} />
    }

    return <p>An error occurred on client</p>
  }
}

export default ErrorPage
