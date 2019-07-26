import * as React from 'react';
import Link from 'next/link';

interface IRuntimeProps {
}

const onclick = () => {
  throw new Error('runtime error')
}

const RuntimePage: React.SFC<IRuntimeProps> = (props) => {
  return (
    <div>
      <h1>Welcome</h1>
      <button onClick={onclick}>Click Me</button>
    </div>
  )
}

export default RuntimePage

