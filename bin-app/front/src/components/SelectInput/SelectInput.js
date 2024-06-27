import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function SelectSmall(props) {
  const [tri, setTri] = React.useState('');


  const handleChange = (event) => {
    setTri(event.target.value);
    props.onTriChange(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 180 }} size="small">
      <InputLabel id="demo-select-small-label">Trier par</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={tri}
        label="trier par"
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>Trier par</em>
        </MenuItem>
        <MenuItem value={10}>Remplissage</MenuItem>
        <MenuItem value={20}>Zone</MenuItem>
        <MenuItem value={30}>Bouches</MenuItem>
      </Select>
    </FormControl>
  );
}