
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Room, Furniture, createRoom, FurnitureType, createFurniture } from '@/models/furniture';
import { toast } from 'sonner';

interface RoomDesignContextType {
  currentRoom: Room | null;
  savedRooms: Room[];
  createNewRoom: (name: string) => void;
  updateRoom: (updatedRoom: Partial<Room>) => void;
  addFurniture: (type: FurnitureType, x: number, y: number) => void;
  updateFurniture: (id: string, updates: Partial<Furniture>) => void;
  removeFurniture: (id: string) => void;
  saveRoom: () => void;
  loadRoom: (roomId: string) => void;
  deleteRoom: (roomId: string) => void;
  selectedFurnitureId: string | null;
  setSelectedFurnitureId: (id: string | null) => void;
}

const RoomDesignContext = createContext<RoomDesignContextType | undefined>(undefined);

export const useRoomDesign = () => {
  const context = useContext(RoomDesignContext);
  if (context === undefined) {
    throw new Error('useRoomDesign must be used within a RoomDesignProvider');
  }
  return context;
};

interface RoomDesignProviderProps {
  children: ReactNode;
}

export const RoomDesignProvider = ({ children }: RoomDesignProviderProps) => {
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [savedRooms, setSavedRooms] = useState<Room[]>([]);
  const [selectedFurnitureId, setSelectedFurnitureId] = useState<string | null>(null);

  const loadSavedRooms = () => {
    try {
      const savedRoomsData = localStorage.getItem('roomDesignerSavedRooms');
      if (savedRoomsData) {
        setSavedRooms(JSON.parse(savedRoomsData));
      }
    } catch (error) {
      console.error('Failed to load saved rooms:', error);
      toast.error('Failed to load saved rooms');
    }
  };

  // Load saved rooms when component mounts
  React.useEffect(() => {
    loadSavedRooms();
  }, []);

  const createNewRoom = (name: string) => {
    const newRoom = createRoom(name);
    setCurrentRoom(newRoom);
    setSelectedFurnitureId(null);
    toast.success(`Created new room: ${name}`);
  };

  const updateRoom = (updatedRoom: Partial<Room>) => {
    if (!currentRoom) return;
    
    setCurrentRoom({
      ...currentRoom,
      ...updatedRoom,
      updatedAt: new Date().toISOString()
    });
  };

  const addFurniture = (type: FurnitureType, x: number, y: number) => {
    if (!currentRoom) return;
    
    const newFurniture = createFurniture(type, x, y);
    
    setCurrentRoom({
      ...currentRoom,
      furniture: [...currentRoom.furniture, newFurniture],
      updatedAt: new Date().toISOString()
    });
    
    setSelectedFurnitureId(newFurniture.id);
    toast.success(`Added ${type}`);
  };

  const updateFurniture = (id: string, updates: Partial<Furniture>) => {
    if (!currentRoom) return;
    
    setCurrentRoom({
      ...currentRoom,
      furniture: currentRoom.furniture.map(item => 
        item.id === id ? { ...item, ...updates } : item
      ),
      updatedAt: new Date().toISOString()
    });
  };

  const removeFurniture = (id: string) => {
    if (!currentRoom) return;
    
    setCurrentRoom({
      ...currentRoom,
      furniture: currentRoom.furniture.filter(item => item.id !== id),
      updatedAt: new Date().toISOString()
    });
    
    if (selectedFurnitureId === id) {
      setSelectedFurnitureId(null);
    }
    
    toast.success('Removed furniture item');
  };

  const saveRoom = () => {
    if (!currentRoom) return;
    
    const updatedRoom = {
      ...currentRoom,
      updatedAt: new Date().toISOString()
    };
    
    const updatedRooms = savedRooms.some(room => room.id === currentRoom.id)
      ? savedRooms.map(room => room.id === currentRoom.id ? updatedRoom : room)
      : [...savedRooms, updatedRoom];
    
    setSavedRooms(updatedRooms);
    setCurrentRoom(updatedRoom);
    
    try {
      localStorage.setItem('roomDesignerSavedRooms', JSON.stringify(updatedRooms));
      toast.success(`Saved room: ${currentRoom.name}`);
    } catch (error) {
      console.error('Failed to save room:', error);
      toast.error('Failed to save room');
    }
  };

  const loadRoom = (roomId: string) => {
    const room = savedRooms.find(room => room.id === roomId);
    
    if (room) {
      setCurrentRoom(room);
      setSelectedFurnitureId(null);
      toast.success(`Loaded room: ${room.name}`);
    } else {
      toast.error('Could not find room');
    }
  };

  const deleteRoom = (roomId: string) => {
    const updatedRooms = savedRooms.filter(room => room.id !== roomId);
    setSavedRooms(updatedRooms);
    
    if (currentRoom && currentRoom.id === roomId) {
      setCurrentRoom(null);
    }
    
    try {
      localStorage.setItem('roomDesignerSavedRooms', JSON.stringify(updatedRooms));
      toast.success('Room deleted');
    } catch (error) {
      console.error('Failed to delete room:', error);
      toast.error('Failed to delete room');
    }
  };

  return (
    <RoomDesignContext.Provider
      value={{
        currentRoom,
        savedRooms,
        createNewRoom,
        updateRoom,
        addFurniture,
        updateFurniture,
        removeFurniture,
        saveRoom,
        loadRoom,
        deleteRoom,
        selectedFurnitureId,
        setSelectedFurnitureId,
      }}
    >
      {children}
    </RoomDesignContext.Provider>
  );
};
