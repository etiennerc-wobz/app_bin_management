import * as React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import chroma from 'chroma-js';


export default function CircularProgressWithLabel(props) {
  const value = props.value*100;
  const size = props.size;
  const [sizeProgress, setSizeProgress] = React.useState();
  const [sizeLabel, setSizeLabel] = React.useState();

  console.log('size:', size);

  React.useEffect(() => {
    if(size==="3"){ //Bin page laptop
      setSizeProgress("15rem");
      setSizeLabel("3.8rem");
    }else if(size==="1"){ //BinList page (laptop+mobile)
      setSizeProgress("4rem");
      setSizeLabel("1.2rem");
    } else if(size==="2"){ //Bin page mobile
      setSizeProgress("5rem");
      setSizeLabel("1.4rem");
    }
  }, [size]);

  const getColor = (value) => {
    const colorScale = chroma.scale(['lightgreen', 'darkred']).mode('lch');
    return colorScale(value / 100).hex();
  };

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' ,marginTop: '10px'}}>
      <CircularProgress size={sizeProgress} variant="determinate" value={value} sx={{color: getColor(value)}} />
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
        <Typography variant="caption" component="div" color="text.secondary" sx={{fontSize: sizeLabel}}>
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}


