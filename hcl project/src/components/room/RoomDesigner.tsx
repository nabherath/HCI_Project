
import React, { useState } from 'react';
import { useRoomDesign } from '@/contexts/RoomDesignContext';
import { FurnitureItem } from './FurnitureItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { FurnitureType, FURNITURE_COLORS } from '@/models/furniture';
import {
  RotateCcw,
  RotateCw,
  Trash2,
  Plus,
  Save,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export const RoomDesigner = () => {
  const { 
    currentRoom, 
    updateRoom, 
    addFurniture, 
    updateFurniture, 
    removeFurniture,
    saveRoom,
    selectedFurnitureId, 
    setSelectedFurnitureId 
  } = useRoomDesign();
  
  const [furnitureType, setFurnitureType] = useState<FurnitureType>('chair');
  
  const handleRoomClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    
    setSelectedFurnitureId(null);
  };

  const handleCreateFurniture = () => {
    if (!currentRoom) {
      toast.error('Please create a room first');
      return;
    }
    
    // Add in the middle of the visible room area
    const x = currentRoom.width / 2 - 50;
    const y = currentRoom.height / 2 - 50;
    
    addFurniture(furnitureType, x, y);
  };

  const handleRotateFurniture = (direction: 'cw' | 'ccw') => {
    if (!currentRoom || !selectedFurnitureId) return;
    
    const furniture = currentRoom.furniture.find(f => f.id === selectedFurnitureId);
    if (!furniture) return;
    
    const rotationChange = direction === 'cw' ? 90 : -90;
    const newRotation = (furniture.rotation + rotationChange) % 360;
    
    updateFurniture(selectedFurnitureId, { rotation: newRotation });
  };

  const handleDeleteFurniture = () => {
    if (!selectedFurnitureId) return;
    
    removeFurniture(selectedFurnitureId);
  };
  
  const handleChangeFurnitureColor = (color: string) => {
    if (!selectedFurnitureId) return;
    
    updateFurniture(selectedFurnitureId, { color });
  };

  if (!currentRoom) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>No room selected. Please create or load a room.</p>
      </div>
    );
  }

  const selectedFurniture = currentRoom.furniture.find(f => f.id === selectedFurnitureId);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-designer-foreground">{currentRoom.name}</h1>
        <Button 
          onClick={() => saveRoom()}
          variant="default"
          className="bg-designer-primary hover:bg-designer-secondary"
        >
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-full">
        <div className="col-span-1 space-y-6">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-4">Room Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="roomName">Room Name</Label>
                  <Input
                    id="roomName"
                    value={currentRoom.name}
                    onChange={(e) => updateRoom({ name: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="roomWidth">Room Width</Label>
                    <Input
                      id="roomWidth"
                      type="number"
                      value={currentRoom.width}
                      onChange={(e) => updateRoom({ width: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="roomHeight">Room Height</Label>
                    <Input
                      id="roomHeight"
                      type="number"
                      value={currentRoom.height}
                      onChange={(e) => updateRoom({ height: Number(e.target.value) })}
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Wall Color</Label>
                  <div className="flex gap-2 flex-wrap mt-1">
                    {['#FFFFFF', '#F1F0FB', '#E5DEFF', '#FDE1D3', '#FEF7CD'].map(color => (
                      <button
                        key={color}
                        className={cn(
                          "w-8 h-8 rounded-full border-2",
                          currentRoom.wallColor === color ? 'border-designer-primary' : 'border-transparent'
                        )}
                        style={{ backgroundColor: color }}
                        onClick={() => updateRoom({ wallColor: color })}
                      />
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label>Floor Color</Label>
                  <div className="flex gap-2 flex-wrap mt-1">
                    {['#F1F0FB', '#FDE1D3', '#D3E4FD', '#F2FCE2', '#FEF7CD'].map(color => (
                      <button
                        key={color}
                        className={cn(
                          "w-8 h-8 rounded-full border-2",
                          currentRoom.floorColor === color ? 'border-designer-primary' : 'border-transparent'
                        )}
                        style={{ backgroundColor: color }}
                        onClick={() => updateRoom({ floorColor: color })}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-4">Add Furniture</h3>
              
              <div className="space-y-4">
                <div>
                  <Label>Furniture Type</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {['chair', 'sofa', 'table', 'bed', 'desk', 'cabinet', 'bookshelf', 'rug'].map(type => (
                      <Button
                        key={type}
                        variant={furnitureType === type ? 'default' : 'outline'}
                        className={furnitureType === type ? 'bg-designer-primary hover:bg-designer-secondary' : ''}
                        onClick={() => setFurnitureType(type as FurnitureType)}
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <Button 
                  onClick={handleCreateFurniture}
                  className="w-full bg-designer-accent hover:bg-designer-secondary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add {furnitureType}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {selectedFurniture && (
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Selected Furniture</h3>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={handleDeleteFurniture}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label>Type</Label>
                    <p className="text-sm font-medium">{selectedFurniture.type}</p>
                  </div>
                  
                  <div>
                    <Label>Position</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="posX" className="text-xs">X</Label>
                        <Input
                          id="posX"
                          type="number"
                          value={Math.round(selectedFurniture.x)}
                          onChange={(e) => updateFurniture(selectedFurniture.id, { x: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="posY" className="text-xs">Y</Label>
                        <Input
                          id="posY"
                          type="number"
                          value={Math.round(selectedFurniture.y)}
                          onChange={(e) => updateFurniture(selectedFurniture.id, { y: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Size</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="width" className="text-xs">Width</Label>
                        <Input
                          id="width"
                          type="number"
                          value={Math.round(selectedFurniture.width)}
                          onChange={(e) => updateFurniture(selectedFurniture.id, { width: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="height" className="text-xs">Height</Label>
                        <Input
                          id="height"
                          type="number"
                          value={Math.round(selectedFurniture.height)}
                          onChange={(e) => updateFurniture(selectedFurniture.id, { height: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center">
                      <Label>Rotation: {selectedFurniture.rotation}°</Label>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleRotateFurniture('ccw')}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleRotateFurniture('cw')}
                        >
                          <RotateCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Slider
                      value={[selectedFurniture.rotation]}
                      min={0}
                      max={359}
                      step={1}
                      onValueChange={(value) => updateFurniture(selectedFurniture.id, { rotation: value[0] })}
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label>Color</Label>
                    <div className="flex gap-2 flex-wrap mt-1">
                      {FURNITURE_COLORS.map(color => (
                        <button
                          key={color}
                          className={cn(
                            "w-8 h-8 rounded-full border-2",
                            selectedFurniture.color === color ? 'border-designer-primary' : 'border-transparent'
                          )}
                          style={{ backgroundColor: color }}
                          onClick={() => handleChangeFurnitureColor(color)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="col-span-1 md:col-span-3 bg-white rounded-lg border shadow-sm overflow-hidden">
          <div
            className="relative room-grid"
            style={{
              width: `${currentRoom.width}px`,
              height: `${currentRoom.height}px`,
              backgroundColor: currentRoom.floorColor,
              border: `6px solid ${currentRoom.wallColor}`,
              overflow: 'hidden',
            }}
            onClick={handleRoomClick}
          >
            {currentRoom.furniture.map((furniture) => (
              <FurnitureItem key={furniture.id} furniture={furniture} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDesigner;
