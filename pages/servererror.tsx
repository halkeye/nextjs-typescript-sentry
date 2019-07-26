import * as React from 'react';

interface IServerProps {
}

export class ServerPage extends React.Component<IServerProps> {
  static async getInitialProps(): Promise<IServerProps> {
    throw new Error('server error')
  }
  render(): React.ReactElement {
    return <div>Server Rendered Page</div>;
  }
}

export default ServerPage

