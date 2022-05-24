import React, {FC} from 'react';
import {AppBar, Divider, IconButton, Toolbar, Typography} from "@mui/material";
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';

interface NavBarProps {
  title: string
}

const NavBar: FC<NavBarProps> = ({title}: NavBarProps) => (
  <AppBar>
    <Toolbar>
      <IconButton
        size={"large"}
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{mr: 2}}
      >
        <MenuOutlinedIcon/>
      </IconButton>
      <Typography
        variant="h6"
        noWrap
        component="a"
        href="/"
        sx={{
          mr: 2,
          display: {xs: 'none', md: 'flex'},
          fontFamily: 'Gill Sans',
          fontWeight: 700,
          letterSpacing: '.1rem',
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        CLEANSAN
      </Typography>
      <Divider
        orientation="vertical"
        variant='middle'
        color='#FFFFFF'
        sx={{borderRightWidth: 3}}
        flexItem
      />
      <Typography
        variant="h6"
        component="div"
        sx={{
          flexGrow: 1,
          ml: 2
        }}
      >
        {title}
      </Typography>
    </Toolbar>
  </AppBar>
);

export default NavBar;
