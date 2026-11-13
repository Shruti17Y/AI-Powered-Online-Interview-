import React from 'react';
import { useAuth } from '../context/AuthContext.js';

const UserDebug = () => {
  const { user } = useAuth();

  return (
    <div className="p-4 bg-gray-100 rounded-lg m-4">
      <h3 className="font-bold mb-2">User Debug Info:</h3>
      <pre className="text-sm bg-white p-2 rounded border">
        {JSON.stringify(user, null, 2)}
      </pre>
      <div className="mt-2">
        <p>User ID: {user?.id}</p>
        <p>User ID Type: {typeof user?.id}</p>
        <p>User Email: {user?.email}</p>
        <p>User Username: {user?.username}</p>
      </div>
    </div>
  );
};

export default UserDebug;
