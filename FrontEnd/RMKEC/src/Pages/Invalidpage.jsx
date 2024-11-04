import React from 'react'
import './Invalidpage.css'; 
const Invalidpage = () => {
  return (
    <div className="not-found-page">
      <h1>404: Page Not Found</h1>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <img src="https://i.imgur.com/qIufhof.png" alt="404 astronaut" />
      <p>But don't worry, you can still explore the galaxy!</p>
      <button onClick={() => window.history.back()}>Go Back</button>
      <button onClick={() => window.location.href = '/dashboard'}>Go Home</button>
    </div>
  ) 
}

export default Invalidpage