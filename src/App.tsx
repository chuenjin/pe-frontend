import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import MapDisplay from './components/MapDisplay/MapDisplay';

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Container maxWidth="xl" sx={{height: '100vh', pt: 2}}>
          <Typography
	    variant="h4"
	    component="h1"
	    sx={{ mb: 2 }}
	  >
	     Weather Stations
          </Typography>
	  <MapDisplay />
      </Container>
    </QueryClientProvider>
  );
}
