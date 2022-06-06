import React, {FC} from 'react';
import {AppBar, Divider, Drawer, IconButton, Toolbar, Typography} from "@mui/material";
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import DrawerMenuItems from "../DrawerMenuItems/DrawerMenuItems";

interface NavBarProps {
  title: string
  menuDrawerOpen: boolean
  onOpenDrawer: (event: React.SyntheticEvent | Event) => void
  onCloseDrawer: (event: React.SyntheticEvent | Event) => void
}

const NAV_BAR_HEIGHT = 10;

const NavBar: FC<NavBarProps> = ({title, menuDrawerOpen, onOpenDrawer, onCloseDrawer}: NavBarProps) => {

  return (
    <AppBar position={'fixed'}>
      <Toolbar>
        <IconButton
          size={"large"}
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{mr: 2}}
          onClick={onOpenDrawer}
        >
          <MenuOutlinedIcon/>
          <Drawer
            anchor='left'
            open={menuDrawerOpen}
            onClose={onCloseDrawer}
            sx={{
              '.MuiBackdrop-root': {backgroundColor: 'transparent'},
              '& .MuiDrawer-paperAnchorLeft': {marginTop: 8} // 64 px, the size of the app bar
            }}
          >
            <DrawerMenuItems/>
          </Drawer>
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
};

export {NAV_BAR_HEIGHT};
export default NavBar;
