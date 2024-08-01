import * as React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import chroma from 'chroma-js';
import zIndex from '@mui/material/styles/zIndex';


export default function CircularProgressWithLabel(props) {
  const value = props.value*100;
  const size = props.size;
  const [sizeProgress, setSizeProgress] = React.useState();
  const [sizeLabel, setSizeLabel] = React.useState();


  React.useEffect(() => {
    if(size==="3"){ //Bin page laptop
      setSizeProgress("15rem");
      setSizeLabel("3.8rem");
    }else if(size==="1"){ //BinList page (laptop+mobile)
      setSizeProgress("4rem");
      setSizeLabel("1.1rem");
    } else if(size==="2"){ //Bin page mobile
      setSizeProgress("5rem");
      setSizeLabel("1.3rem");
    }
  }, [size]);

  const getColor = (value) => {
    const colorScale = chroma.scale(['lime', 'red']).mode('lch');
    return colorScale( ((value-30)*2) / 90).hex();
  };

  return (
<Box sx={{ 
  position: 'relative', 
  display: 'inline-flex' ,
  marginTop: '2px', 
  backgroundColor: chroma(getColor(value)).alpha(0.1).css(),
  borderRadius: '50%', 
  boxShadow: `0px 0px 5px 0px ${getColor(value)}`,
}}>
      <CircularProgress 
        size={sizeProgress} 
        variant="determinate" 
        value={value >= 100 ? 100 : value} 
        sx={{color: getColor(value), zIndex: 9}}
        className={value >= 90 ? 'animate-blink' : ''} 
        thickness={5}
      />       
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
        <Typography variant="caption" component="div" color="#143330"
         sx={{fontSize: sizeLabel}}>
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}


