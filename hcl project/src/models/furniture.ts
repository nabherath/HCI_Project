
export type FurnitureType = 
  | 'chair'
  | 'sofa'
  | 'table'
  | 'bed'
  | 'cabinet'
  | 'desk'
  | 'bookshelf'
  | 'rug';

export interface Furniture {
  id: string;
  type: FurnitureType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
}

export interface Room {
  id: string;
  name: string;
  width: number;
  height: number;
  wallColor: string;
  floorColor: string;
  furniture: Furniture[];
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_FURNITURE_SIZES: Record<FurnitureType, { width: number; height: number }> = {
  chair: { width: 50, height: 50 },
  sofa: { width: 150, height: 80 },
  table: { width: 100, height: 60 },
  bed: { width: 140, height: 200 },
  cabinet: { width: 80, height: 40 },
  desk: { width: 120, height: 60 },
  bookshelf: { width: 90, height: 30 },
  rug: { width: 150, height: 120 }
};

export const FURNITURE_COLORS = [
  '#9b87f5', // Purple
  '#7E69AB', // Dark purple
  '#F2FCE2', // Soft green
  '#FEF7CD', // Soft yellow
  '#FEC6A1', // Soft orange
  '#D3E4FD', // Soft blue
  '#F1F0FB', // Soft gray
  '#FFDEE2', // Soft pink
  '#403E43', // Charcoal gray
  '#1EAEDB', // Bright blue
];

export const generateFurnitureId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

export const createFurniture = (
  type: FurnitureType,
  x: number,
  y: number,
  color: string = FURNITURE_COLORS[0]
): Furniture => {
  const { width, height } = DEFAULT_FURNITURE_SIZES[type];
  
  return {
    id: generateFurnitureId(),
    type,
    x,
    y,
    width,
    height,
    rotation: 0,
    color,
  };
};

export const createRoom = (name: string): Room => {
  return {
    id: generateFurnitureId(),
    name,
    width: 500,
    height: 400,
    wallColor: '#FFFFFF',
    floorColor: '#F1F0FB',
    furniture: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};
