import { Card, CardContent, Typography, Box } from '@mui/material';
import type { CategoryCardProps } from '../types';

export const CategoryCard: React.FC<CategoryCardProps> = ({ title, icon, onClick }) => {
  return (
    <Card 
      sx={{ 
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3
        },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Box sx={{ fontSize: '2.5rem', color: 'primary.main' }}>
            {icon}
          </Box>
          <Typography variant="h6" component="div" align="center">
            {title}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}; 