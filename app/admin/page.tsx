'use client';

import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { getAllPointsAction, incrementPointsAction } from '@/actions/points-actions';
import { SelectPoints } from '@/db/schema/points-schema';
import { getProfileByUserIdAction } from '@/actions/profiles-actions';
import { SelectProfile } from '@/db/schema/profiles-schema';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';

interface User {
  userId: string;
  points: number;
  email?: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { userId } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [pointsToAdd, setPointsToAdd] = useState(0);

  useEffect(() => {
    fetchUsers();
    checkAdminStatus();
  }, [userId]);

  const checkAdminStatus = async () => {
    if (!userId) return;
    try {
      const result = await getProfileByUserIdAction(userId) as { data: SelectProfile };
      if (result.data) {
        console.log(result.data);
        setIsAdmin(result.data.isAdmin || false);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      setIsAdmin(false);
      console.error('Error checking admin status:', error);
    }
  };

  const fetchUsers = async () => {
    const result = await getAllPointsAction();
    if (result.status === 'success' && result.data) {
      setUsers(result.data as User[]);
    }
  };

  const updatePoints = async (amount: number) => {
    if (!selectedUser) return;

    const result = await incrementPointsAction(selectedUser.userId, amount);

    if (result.status === 'success') {
      fetchUsers(); // Refresh the user list
      const updatedUser = users.find(u => u.userId === selectedUser.userId);
      setSelectedUser(updatedUser || null);
    }
  };

  if (!isAdmin) {
    return <div className="p-4">Access denied. Admin only.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Users</h2>
          <div className="space-y-2">
            {users.map((user) => (
              <div
                key={user.userId}
                className={`p-2 border rounded cursor-pointer ${selectedUser?.userId === user.userId ? 'bg-blue-100' : ''
                  }`}
                onClick={() => setSelectedUser(user)}
              >
                <p>{user.userId}</p>
                <p className="text-sm text-gray-600">Points: {user.points}</p>
              </div>
            ))}
          </div>
        </div>

        {selectedUser && (
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">Modify Points</h2>
            <p className="mb-2">Selected User ID: {selectedUser.userId}</p>
            <p className="mb-4">Current Points: {selectedUser.points}</p>

            <div className="flex flex-row flex-wrap gap-2 justify-start">
              <Button variant="outline" className="text-green-500" onClick={() => updatePoints(10)}>+10</Button>
              <Button variant="outline" className="text-green-500" onClick={() => updatePoints(100)}>+100</Button>
              <Button variant="outline" className="text-green-500" onClick={() => updatePoints(1000)}>+1000</Button>
              <Button variant="outline" className="text-green-500" onClick={() => updatePoints(10000)}>+10000</Button>
              <Button variant="outline" className="text-green-500" onClick={() => updatePoints(100000)}>+100000</Button>
              <Input type="number" className="w-20" value={pointsToAdd} onChange={(e) => setPointsToAdd(parseInt(e.target.value))} />
              <Button variant="outline" className="text-green-500" onClick={() => updatePoints(pointsToAdd)}>+</Button>
              <Button variant="outline" className="text-red-500" onClick={() => updatePoints(-pointsToAdd)}>-</Button>
            </div>

            <Separator className="my-4" />

            <div className="flex flex-row flex-wrap gap-2 justify-start">
              <Button variant="outline" className="text-red-500" onClick={() => updatePoints(-10)}>-10</Button>
              <Button variant="outline" className="text-red-500" onClick={() => updatePoints(-100)}>-100</Button>
              <Button variant="outline" className="text-red-500" onClick={() => updatePoints(-1000)}>-1000</Button>
              <Button variant="outline" className="text-red-500" onClick={() => updatePoints(-10000)}>-10000</Button>
              <Button variant="outline" className="text-red-500" onClick={() => updatePoints(-100000)}>-100000</Button>


            </div>
          </div>
        )}
      </div>
    </div>
  );
} 