import React, { useState, useEffect } from 'react';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

const POIFilter = ({ pois, onFilterChange }) => {
  const [states, setStates] = useState([]);
  const [selectedStates, setSelectedStates] = useState({});

  // Extract unique cities when locations change
  useEffect(() => {
    if (pois && pois.length > 0) {
      // Get unique city names
      const uniqueStates = [...new Set(pois.map(poi => poi.state))].filter(Boolean);
      
      // Sort cities alphabetically
      uniqueStates.sort();
      
      setStates(uniqueStates);
      
      // Initialize all cities as selected
      const initialSelectedState = {};
      uniqueStates.forEach(state => {
        initialSelectedState[state] = true;
      });
      
      setSelectedStates(initialSelectedState);
    }
  }, [pois]);

  // Handle checkbox change
  const handleCheckboxChange = (state) => {
    const updatedSelectedStates = {
      ...selectedStates,
      [state]: !selectedStates[state]
    };
    
    setSelectedStates(updatedSelectedStates);
    
    // Pass the selected cities up to parent component
    const filteredStates = Object.keys(updatedSelectedStates).filter(
      state => updatedSelectedStates[state]
    );
    
    onFilterChange(filteredStates);
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
	Filter by State
      </Typography>
      {states.length > 0 ? (
        <Stack>
          {states.map(state => (
	    <FormControlLabel
	      key={state}
	      control={
		<Checkbox
		  id={`state-${state}`}
                  checked={selectedStates[state] || false}
                  onChange={() => handleCheckboxChange(state)}
		/>
	      }
	      label={state}
	    />
          ))}
	</Stack>
      ) : (
        <Typography>No states available</Typography>
      )}
	
    </>
  );
};

export default POIFilter;
