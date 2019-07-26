import * as React from 'react';
import Link from 'next/link';

interface IIndexProps {
}

const IndexPage: React.SFC<IIndexProps> = () => {
  return (
    <div>
      <h1>Welcome</h1>
      <ul>
        <li><Link href="/servererror"><a>Server Error</a></Link></li>
        <li><Link href="/runtimeerror"><a>Runtime Error</a></Link></li>
      </ul>
    </div>
  )
}

export default IndexPage
