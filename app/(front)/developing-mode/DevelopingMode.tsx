// app/(front)/developing-mode/DevelopingMode.tsx
import React from 'react'

const DevelopingMode: React.FC = () => {
  return (
    <div className="developing-mode-container">
      <h1 className="developing-mode-title">Application is in Developing Mode X</h1>
      <p className="developing-mode-message">Sorry for the inconvenience, we are currently working on improvements.</p>
    </div>
  )
}

export default DevelopingMode
