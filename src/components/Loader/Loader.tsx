import React, { useEffect, useState } from 'react';

export const Loader: React.FC = () => {
  const [off, setOff] = useState<boolean>(false);

  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => {
        setOff(true);
      }, 800);
    };
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  return (
    <div className={`loader ${off ? 'off' : ''}`} id="loader">
      <div>
        <i></i>initializing operating environment
      </div>
    </div>
  );
};
