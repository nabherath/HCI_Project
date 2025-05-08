
import React from 'react';
import ThreeDViewer from '@/components/threejs/ThreeDViewer';
import { useRoomDesign } from '@/contexts/RoomDesignContext';
import { Button } from '@/components/ui/button';
import { Sofa, Box } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ThreeDViewerPage = () => {
  const { currentRoom } = useRoomDesign();
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-designer-foreground">
          3D View {currentRoom && `- ${currentRoom.name}`}
        </h1>
        
        {currentRoom && (
          <Button 
            variant="outline"
            onClick={() => navigate('/room-designer')}
          >
            <Sofa className="h-4 w-4 mr-2" />
            Back to 2D Editor
          </Button>
        )}
      </div>
      
      <div className="relative flex-1 bg-gray-100 rounded-lg overflow-hidden border shadow-sm">
        <ThreeDViewer />
        
        <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm p-3 rounded-md text-sm shadow-sm">
          <div className="flex items-center mb-2">
            <Box className="h-4 w-4 mr-2 text-designer-primary" />
            <span className="font-medium">3D Controls</span>
          </div>
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li>• Click and drag to rotate view</li>
            <li>• Scroll to zoom in/out</li>
            <li>• Right-click and drag to pan</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ThreeDViewerPage;
