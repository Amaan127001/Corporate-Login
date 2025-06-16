import React from 'react';

const Welcome = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-green-50">
      <h1 className="text-5xl font-bold">Welcome, {user.name}!</h1>
      <p className="text-3xl mt-2">{user.email}</p>
    </div>
  );
};


export default Welcome;
