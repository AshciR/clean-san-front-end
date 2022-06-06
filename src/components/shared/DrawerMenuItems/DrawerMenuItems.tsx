import {FC} from "react";
import {Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import CleaningServicesOutlinedIcon from '@mui/icons-material/CleaningServicesOutlined';

type menuItemTypes = 'Dashboard'
  | 'Clients'
  | 'Services'

interface DrawerMenuItemsProps {

}

const DrawerMenuItems: FC<DrawerMenuItemsProps> = () => {

  const menuItems: ({ text: menuItemTypes; icon: JSX.Element })[] = [
    {
      text: 'Dashboard',
      icon: <DashboardOutlinedIcon/>
    },
    {
      text: 'Clients',
      icon: <BusinessOutlinedIcon/>
    },
    {
      text: 'Services',
      icon: <CleaningServicesOutlinedIcon/>
    }
  ];

  return (
    <Box
      role='presentation'
      sx={{width: 400}}
    >
      <List>
        {menuItems.map(item =>
          <ListItem key={item.text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text}/>
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  )
}

export default DrawerMenuItems;