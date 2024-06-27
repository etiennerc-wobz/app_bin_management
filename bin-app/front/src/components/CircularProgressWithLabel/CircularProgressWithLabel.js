import * as React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import chroma from 'chroma-js';


export default function CircularProgressWithLabel(props) {
  const value = props.value*100;

  const getColor = (value) => {
    const colorScale = chroma.scale(['lightgreen', 'darkred']).mode('lch');
    return colorScale(value / 100).hex();
  };

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' ,marginTop: '10px'}}>
      <CircularProgress variant="determinate" value={value} sx={{color: getColor(value)}} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}


