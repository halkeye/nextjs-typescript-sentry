import * as React from 'react';

interface IRuntimeProps {
}

const onclick = () => {
  throw new Error('runtime error')
}

const RuntimePage: React.SFC<IRuntimeProps> = () => {
  return (
    <div>
      <h1>Welcome</h1>
      <button onClick={onclick}>Click Me</button>
    </div>
  )
}

export default RuntimePage

