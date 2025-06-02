import React from 'react';

function Loader() {
  return (
    <div className="loader-container" style={{ textAlign: 'center', padding: '20px' }}>
      <p>Loading...</p>
      {/* Можете добавить сюда CSS для спиннера или анимации */}
    </div>
  );
}

export default Loader;
