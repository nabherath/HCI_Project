
import React, { useState } from 'react';
import RoomDesigner from '@/components/room/RoomDesigner';
import { useRoomDesign } from '@/contexts/RoomDesignContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

const RoomDesignerPage = () => {
  const { currentRoom, createNewRoom } = useRoomDesign();
  const navigate = useNavigate();
  const [newRoomDialogOpen, setNewRoomDialogOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  
  const handleCreateRoom = () => {
    if (newRoomName.trim() === '') return;
    
    createNewRoom(newRoomName);
    setNewRoomDialogOpen(false);
    setNewRoomName('');
  };
  
  if (!currentRoom) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <p className="text-xl">No room selected</p>
        <Button 
          onClick={() => setNewRoomDialogOpen(true)}
          className="bg-designer-primary hover:bg-designer-secondary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create a new room
        </Button>
        
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
  }
  
  return <RoomDesigner />;
};

export default RoomDesignerPage;
