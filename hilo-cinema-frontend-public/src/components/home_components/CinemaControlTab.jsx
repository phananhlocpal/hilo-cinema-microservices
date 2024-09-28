import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

export default function CinemaControlTab(props) {
  const valueIndex = useSelector((state) => state.home.tabValue)
  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Tabs value={valueIndex} onChange={props.onChange}>
        <Tab label="Đang chiếu" />
        <Tab label="Sắp chiếu" />
      </Tabs>
    </Box>
  );
}

CinemaControlTab.propTypes = {
  onChange: PropTypes.func.isRequired,
}
