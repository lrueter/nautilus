import type { Category } from '../config/firebase';

export interface Document {
  name: string;
  url: string;
  type: string;
  size: number;
  lastModified: Date;
}

export interface CategoryCardProps {
  title: Category;
  icon: React.ReactNode;
  onClick: () => void;
}

export interface FileListProps {
  category: Category;
}

export interface PhotoGalleryProps {
  images: Document[];
} 