
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRoomDesign } from '@/contexts/RoomDesignContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import {
  Plus,
  LayoutDashboard,
  Sofa,
  FolderOpen,
  Box,
  Clock,
  Edit3
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { savedRooms, currentRoom, createNewRoom, loadRoom } = useRoomDesign();
  const [newRoomDialogOpen, setNewRoomDialogOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    if (newRoomName.trim() === '') return;
    
    createNewRoom(newRoomName);
    setNewRoomDialogOpen(false);
    setNewRoomName('');
    navigate('/room-designer');
  };

  const handleLoadRoom = (roomId: string) => {
    loadRoom(roomId);
    navigate('/room-designer');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-designer-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name || 'User'}</p>
        </div>
        <Button 
          onClick={() => setNewRoomDialogOpen(true)}
          className="bg-designer-primary hover:bg-designer-secondary"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Room
        </Button>
      </div>
      
      {currentRoom && (
        <Card className="bg-designer-muted border-designer-border">
          <CardHeader>
            <CardTitle className="text-xl">Current Project</CardTitle>
            <CardDescription>Continue working on your current room design</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">{currentRoom.name}</h3>
                <p className="text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Last updated: {formatDate(currentRoom.updatedAt)}
                </p>
                <p className="text-sm mt-1">
                  {currentRoom.furniture.length} furniture items
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate('/room-designer')}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="default"
                  className="bg-designer-accent hover:bg-designer-secondary"
                  onClick={() => navigate('/3d-viewer')}
                >
                  <Box className="h-4 w-4 mr-2" />
                  View in 3D
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:border-designer-primary cursor-pointer transition-colors" onClick={() => setNewRoomDialogOpen(true)}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="h-5 w-5 mr-2 text-designer-primary" />
                New Room
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Create a new room from scratch</p>
            </CardContent>
          </Card>
          
          <Card className="hover:border-designer-primary cursor-pointer transition-colors" onClick={() => navigate('/room-designer')}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sofa className="h-5 w-5 mr-2 text-designer-primary" />
                Room Designer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Open the 2D room designer tool</p>
            </CardContent>
          </Card>
          
          <Card className="hover:border-designer-primary cursor-pointer transition-colors" onClick={() => navigate('/saved-layouts')}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FolderOpen className="h-5 w-5 mr-2 text-designer-primary" />
                Saved Layouts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">View and load your saved room layouts</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {savedRooms.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedRooms
              .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .slice(0, 6)
              .map((room) => (
                <Card
                  key={room.id}
                  className="hover:border-designer-primary cursor-pointer transition-colors"
                  onClick={() => handleLoadRoom(room.id)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{room.name}</CardTitle>
                    <CardDescription>
                      <Clock className="h-4 w-4 inline mr-1" />
                      {formatDate(room.updatedAt)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-sm">{room.furniture.length} furniture items</p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}
      
      <Dialog open={newRoomDialogOpen} onOpenChange={setNewRoomDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new room</DialogTitle>
            <DialogDescription>
              Enter a name for your new room design.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="My Living Room"
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewRoomDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateRoom}
              className="bg-designer-primary hover:bg-designer-secondary"
              disabled={!newRoomName.trim()}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
