import React, {FC} from 'react';
import NavBar from "../NavBar/NavBar";
import {Box} from "@mui/material";

interface NavBarWrapperProps {
  title: string
  children?: React.ReactNode
}

const NavBarWrapper: FC<NavBarWrapperProps> = ({title, children}) => {

  const [menuDrawerOpen, setMenuDrawerOpen] = React.useState<boolean>(false)
  const toggleDrawer = () => setMenuDrawerOpen(!menuDrawerOpen);

  return (
    <Box sx={{marginBottom: 10}}>
      <NavBar
        title={title}
        menuDrawerOpen={menuDrawerOpen}
        onOpenDrawer={toggleDrawer}
        onCloseDrawer={toggleDrawer}
      />
      {children}
    </Box>
  );
};

export default NavBarWrapper;
