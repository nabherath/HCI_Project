
import React, { useState, useRef } from 'react';
import { Furniture } from '@/models/furniture';
import { useRoomDesign } from '@/contexts/RoomDesignContext';
import { cn } from '@/lib/utils';

interface FurnitureItemProps {
  furniture: Furniture;
}

export const FurnitureItem = ({ furniture }: FurnitureItemProps) => {
  const { updateFurniture, selectedFurnitureId, setSelectedFurnitureId } = useRoomDesign();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const furnitureRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!furnitureRef.current) return;
    
    setSelectedFurnitureId(furniture.id);
    setIsDragging(true);
    
    const rect = furnitureRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setSelectedFurnitureId(furniture.id);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      updateFurniture(furniture.id, {
        x: Math.max(0, newX),
        y: Math.max(0, newY)
      });
    } else if (isResizing && furnitureRef.current) {
      const rect = furnitureRef.current.getBoundingClientRect();
      const newWidth = Math.max(30, e.clientX - rect.left);
      const newHeight = Math.max(30, e.clientY - rect.top);
      
      updateFurniture(furniture.id, {
        width: newWidth,
        height: newHeight
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  React.useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing]);

  const isSelected = selectedFurnitureId === furniture.id;

  return (
    <div
      ref={furnitureRef}
      className={cn(
        'furniture-item',
        isSelected && 'border-designer-primary border-2 shadow-md z-10'
      )}
      style={{
        left: `${furniture.x}px`,
        top: `${furniture.y}px`,
        width: `${furniture.width}px`,
        height: `${furniture.height}px`,
        backgroundColor: furniture.color,
        transform: `rotate(${furniture.rotation}deg)`,
        borderColor: isSelected ? 'var(--designer-primary)' : 'transparent'
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="text-center text-xs text-white pt-1 truncate font-medium">
        {furniture.type}
      </div>
      
      {isSelected && (
        <div
          className="furniture-handle"
          onMouseDown={handleResizeStart}
        />
      )}
    </div>
  );
};

export default FurnitureItem;
