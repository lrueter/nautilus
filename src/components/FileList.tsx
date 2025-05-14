import React, { useEffect, useState, useRef } from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Typography, 
  CircularProgress,
  Box,
  IconButton,
  Tooltip,
  Button,
  LinearProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { 
  Description as DescriptionIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  Download as DownloadIcon,
  OpenInNew as OpenInNewIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { getStorage, ref, listAll, getDownloadURL, getMetadata, uploadBytesResumable, deleteObject } from 'firebase/storage';
import { auth } from '../config/firebase';
import { ADMIN_EMAILS } from '../config/admins';
import { FOLDER_MAPPING } from '../constants';
import type { Category } from '../constants';
import type { Document } from '../types';

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB in bytes

interface FileListProps {
  category: Category;
  onFilesLoaded?: (files: Document[]) => void;
  hideList?: boolean;
}

const FileList: React.FC<FileListProps> = ({ category, onFilesLoaded, hideList = false }) => {
  const [files, setFiles] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<Document | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAdmin = auth.currentUser?.email ? ADMIN_EMAILS.includes(auth.currentUser.email) : false;

  const handleDeleteClick = (file: Document) => {
    setFileToDelete(file);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!fileToDelete) return;

    try {
      const storage = getStorage();
      const folderPath = FOLDER_MAPPING[category];
      const fileRef = ref(storage, `${folderPath}/${fileToDelete.name}`);
      
      await deleteObject(fileRef);
      setDeleteDialogOpen(false);
      setFileToDelete(null);
      // Refresh the file list
      fetchFiles();
    } catch (err) {
      console.error('Delete error:', err);
      setDeleteError('Failed to delete file. Please try again.');
      setDeleteDialogOpen(false);
      setFileToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setFileToDelete(null);
  };

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds 15 MB limit. Current size: ${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    }

    if (category === 'Photos') {
      if (!file.type.startsWith('image/')) {
        return 'Only image files are allowed in the Photos folder';
      }
    } else {
      if (file.type !== 'application/pdf') {
        return 'Only PDF files are allowed in this folder';
      }
    }

    return null;
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setUploadError(validationError);
      return;
    }

    try {
      const storage = getStorage();
      const folderPath = FOLDER_MAPPING[category];
      const fileRef = ref(storage, `${folderPath}/${file.name}`);
      
      const uploadTask = uploadBytesResumable(fileRef, file);
      
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Upload error:', error);
          setUploadError('Failed to upload file. Please try again.');
          setUploadProgress(null);
        },
        async () => {
          // Upload completed successfully
          setUploadProgress(null);
          // Refresh the file list
          fetchFiles();
        }
      );
    } catch (err) {
      console.error('Upload error:', err);
      setUploadError('Failed to upload file. Please try again.');
      setUploadProgress(null);
    }
  };

  const fetchFiles = async () => {
    if (!auth.currentUser) {
      setError('Please log in to view files');
      setLoading(false);
      return;
    }

    try {
      const storage = getStorage();
      const folderPath = FOLDER_MAPPING[category];
      const folderRef = ref(storage, folderPath);
      
      const result = await listAll(folderRef);
      const filePromises = result.items.map(async (item) => {
        const url = await getDownloadURL(item);
        const metadata = await getMetadata(item);
        return {
          name: item.name,
          url,
          type: metadata.contentType || 'application/octet-stream',
          size: metadata.size,
          lastModified: new Date(metadata.timeCreated)
        };
      });

      const fileList = await Promise.all(filePromises);
      setFiles(fileList);
      onFilesLoaded?.(fileList);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching files:', err);
      setError('Error loading files. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [category, onFilesLoaded]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">
          {files.length === 0 ? 'No files found in this category.' : 'Files'}
        </Typography>
        <Button
          variant="contained"
          startIcon={<UploadIcon />}
          onClick={handleUploadClick}
          disabled={!auth.currentUser}
        >
          Upload {category === 'Photos' ? 'Photo' : 'PDF'}
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          accept={category === 'Photos' ? 'image/*' : '.pdf'}
          style={{ display: 'none' }}
        />
      </Box>

      {uploadProgress !== null && (
        <Box mb={2}>
          <LinearProgress variant="determinate" value={uploadProgress} />
          <Typography variant="body2" color="textSecondary" align="center" mt={1}>
            Uploading... {Math.round(uploadProgress)}%
          </Typography>
        </Box>
      )}

      <Snackbar
        open={!!uploadError || !!deleteError}
        autoHideDuration={6000}
        onClose={() => {
          setUploadError(null);
          setDeleteError(null);
        }}
      >
        <Alert 
          onClose={() => {
            setUploadError(null);
            setDeleteError(null);
          }} 
          severity="error"
        >
          {uploadError || deleteError}
        </Alert>
      </Snackbar>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Delete File</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{fileToDelete?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {!hideList && files.length > 0 && (
        <List>
          {files.map((file) => {
            const isImage = file.type.startsWith('image/');
            const isPdf = file.type === 'application/pdf';
            
            return (
              <ListItem
                key={file.name}
                secondaryAction={
                  <Box>
                    <Tooltip title="Download">
                      <IconButton 
                        edge="end" 
                        aria-label="download"
                        onClick={() => window.open(file.url, '_blank')}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Open in new tab">
                      <IconButton 
                        edge="end" 
                        aria-label="open in new tab"
                        onClick={() => window.open(file.url, '_blank')}
                      >
                        <OpenInNewIcon />
                      </IconButton>
                    </Tooltip>
                    {isAdmin && (
                      <Tooltip title="Delete">
                        <IconButton 
                          edge="end" 
                          aria-label="delete"
                          onClick={() => handleDeleteClick(file)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                }
              >
                <ListItemIcon>
                  {isImage ? (
                    <ImageIcon />
                  ) : isPdf ? (
                    <PdfIcon />
                  ) : (
                    <DescriptionIcon />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={file.name}
                  secondary={`${(file.size / 1024).toFixed(1)} KB • ${file.lastModified.toLocaleDateString()}`}
                />
              </ListItem>
            );
          })}
        </List>
      )}
    </Box>
  );
};

export default FileList; 