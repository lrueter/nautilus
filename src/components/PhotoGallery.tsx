import { useState } from 'react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import { Box, Typography } from '@mui/material';
import type { PhotoGalleryProps, Document } from '../types';

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ images }) => {
  const galleryItems = images.map((image) => ({
    original: image.url,
    thumbnail: image.url,
    description: image.name,
  }));

  if (images.length === 0) {
    return (
      <Box p={3}>
        <Typography>No images found in this category.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <ImageGallery
        items={galleryItems}
        showPlayButton={false}
        showFullscreenButton={true}
        showNav={true}
        showThumbnails={true}
        thumbnailPosition="bottom"
        slideInterval={0}
        additionalClass="custom-gallery"
      />
    </Box>
  );
}; 