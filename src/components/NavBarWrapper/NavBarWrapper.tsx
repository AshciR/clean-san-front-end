import React, {FC, PropsWithChildren} from 'react';
import NavBar from "../NavBar/NavBar";
import {Box} from "@mui/material";

interface NavBarWrapperProps {
  props?: PropsWithChildren<NavBarWrapperProps>
}

const NavBarWrapper: FC<NavBarWrapperProps> = (props) => {

  const [menuDrawerOpen, setMenuDrawerOpen] = React.useState<boolean>(false)
  const toggleDrawer = () => setMenuDrawerOpen(!menuDrawerOpen);

  return (
    <Box sx={{marginBottom: 10}}>
      <NavBar
        title={'Dashboard'}
        menuDrawerOpen={menuDrawerOpen}
        onOpenDrawer={toggleDrawer}
        onCloseDrawer={toggleDrawer}
      />
      {props.children}
    </Box>
  );
};

export default NavBarWrapper;
