import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Grid as MuiGrid,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  CardActionArea
} from '@mui/material';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import {
  Dashboard as DashboardIcon,
  ElectricBolt as ElectricIcon,
  Cable as CableIcon,
  Schedule as ScheduleIcon,
  Security as SecurityIcon,
  Map as MapIcon,
  PhotoLibrary as PhotoIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import FileList from './components/FileList';
import { PhotoGallery } from './components/PhotoGallery';
import { Login } from './components/Login';
import { FOLDER_MAPPING } from './constants';
import type { Category } from './constants';
import type { Document } from './types';

const CATEGORIES = [
  { id: 'SWL', label: 'Switchboard Layout', icon: DashboardIcon },
  { id: 'WID', label: 'Wiring Diagram', icon: ElectricIcon },
  { id: 'CAR', label: 'Cable Routing', icon: CableIcon },
  { id: 'CAS', label: 'Cable Schedule', icon: ScheduleIcon },
  { id: 'PRS', label: 'Protection Schedule', icon: SecurityIcon },
  { id: 'INZ', label: 'Installation Zones', icon: MapIcon },
  { id: 'Photos', label: 'Photos', icon: PhotoIcon }
] as const;

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const CategoryCard: React.FC<{
  title: string;
  icon: React.ComponentType<{ sx?: any }>;
  onClick: () => void;
}> = ({ title, icon: Icon, onClick }) => (
  <Card sx={{ height: '100%' }}>
    <CardActionArea onClick={onClick} sx={{ height: '100%' }}>
      <CardContent sx={{ textAlign: 'center', py: 3 }}>
        <Box sx={{ mb: 1 }}>
          <Icon sx={{ fontSize: 40 }} />
        </Box>
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <MuiGrid container spacing={3}>
        {CATEGORIES.map(({ id, label, icon: Icon }) => (
          <MuiGrid 
            key={id} 
            sx={{
              width: {
                xs: '100%',
                sm: '50%',
                md: '33.33%',
                lg: '25%'
              }
            }}
          >
            <CategoryCard
              title={label}
              icon={Icon}
              onClick={() => navigate(`/category/${FOLDER_MAPPING[id as Category]}`)}
            />
          </MuiGrid>
        ))}
      </MuiGrid>
    </Container>
  );
};

const CategoryView = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<Document[]>([]);
  const category = Object.entries(FOLDER_MAPPING).find(
    ([_, folder]) => folder === window.location.pathname.split('/').pop()
  )?.[0] as Category | undefined;

  if (!category) {
    navigate('/');
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          {CATEGORIES.find(c => c.id === category)?.label || category}
        </Typography>
      </Box>
      {category === 'Photos' ? (
        <>
          <FileList 
            category={category} 
            onFilesLoaded={setImages}
            hideList={true}
          />
          <PhotoGallery images={images} />
        </>
      ) : (
        <FileList category={category} />
      )}
    </Container>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/category/:folder"
          element={
            <ProtectedRoute>
              <CategoryView />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
