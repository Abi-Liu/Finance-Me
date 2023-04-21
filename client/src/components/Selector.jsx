import { Box, TextField, MenuItem } from "@mui/material";

const Selector = ({ month, setMonth }) => {
  function handleChange(event) {
    setMonth(event.target.value);
  }
  return (
    <Box width="100px">
      <TextField
        label="Month"
        select
        value={month}
        onChange={handleChange}
        fullWidth
      >
        <MenuItem value={1}>1</MenuItem>
        <MenuItem value={2}>2</MenuItem>
        <MenuItem value={3}>3</MenuItem>
        <MenuItem value={4}>4</MenuItem>
        <MenuItem value={5}>5</MenuItem>
        <MenuItem value={6}>6</MenuItem>
        <MenuItem value={7}>7</MenuItem>
        <MenuItem value={8}>8</MenuItem>
        <MenuItem value={9}>9</MenuItem>
        <MenuItem value={10}>10</MenuItem>
        <MenuItem value={11}>11</MenuItem>
        <MenuItem value={12}>12</MenuItem>
      </TextField>
    </Box>
  );
};

export default Selector;
