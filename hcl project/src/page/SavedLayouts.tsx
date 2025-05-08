import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoomDesign } from '@/contexts/RoomDesignContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import {
  Clock,
  FolderOpen,
  Trash2,
  Edit3,
  Box,
  AlertTriangle
} from 'lucide-react';
import { useState } from 'react';

const SavedLayouts = () => {
  const { savedRooms, loadRoom, deleteRoom } = useRoomDesign();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const handleLoadRoom = (roomId: string) => {
    loadRoom(roomId);
    navigate('/room-designer');
  };
  
  const handleDeleteClick = (roomId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRoomToDelete(roomId);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (roomToDelete) {
      deleteRoom(roomToDelete);
      setDeleteDialogOpen(false);
      setRoomToDelete(null);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  if (savedRooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <FolderOpen className="h-16 w-16 text-brown-600" />
        <h2 className="text-2xl font-medium text-brown-900">No Saved Layouts</h2>
        <p className="text-brown-700 text-center max-w-md">
          You haven't saved any room layouts yet. Create a new room design and save it to see it here.
        </p>
        <Button 
          onClick={() => navigate('/dashboard')}
          className="bg-brown-900 hover:bg-brown-800 mt-4"
        >
          Return to Dashboard
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brown-900">Saved Layouts</h1>
          <p className="text-brown-700">
            {savedRooms.length} {savedRooms.length === 1 ? 'layout' : 'layouts'} saved
          </p>
        </div>
        <Button 
          onClick={() => navigate('/dashboard')}
          variant="outline"
          className="border-brown-300 text-brown-800 hover:bg-brown-50"
        >
          Return to Dashboard
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {savedRooms
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          .map((room) => (
            <Card
              key={room.id}
              className="hover:border-brown-800 cursor-pointer transition-colors"
              onClick={() => handleLoadRoom(room.id)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-brown-900">{room.name}</CardTitle>
                <CardDescription className="text-brown-600">
                  <Clock className="h-4 w-4 inline mr-1 text-brown-700" />
                  {formatDate(room.updatedAt)}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-brown-700">{room.furniture.length} furniture items</p>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-brown-100"
                      title="View in 3D"
                      onClick={(e) => {
                        e.stopPropagation();
                        loadRoom(room.id);
                        navigate('/3d-viewer');
                      }}
                    >
                      <Box className="h-4 w-4 text-brown-700" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-brown-100"
                      title="Delete"
                      onClick={(e) => handleDeleteClick(room.id, e)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-brown-900">
              <AlertTriangle className="h-5 w-5 text-destructive mr-2" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="text-brown-700">
              Are you sure you want to delete this room layout? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              className="border-brown-300 text-brown-800 hover:bg-brown-50"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SavedLayouts;