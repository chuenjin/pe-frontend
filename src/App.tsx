import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import MapDisplay from './components/MapDisplay/MapDisplay';

export default function App() {
  return (
    <Container maxWidth="xl" sx={{height: '100vh'}}>
      <Box sx={{ my: 4, height: '100%' }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Weather Stations
        </Typography>
	<MapDisplay />
      </Box>
    </Container>
  );
}
