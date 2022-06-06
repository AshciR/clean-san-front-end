import {FC} from "react";
import {Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import CleaningServicesOutlinedIcon from '@mui/icons-material/CleaningServicesOutlined';
import {Link} from "react-router-dom";
import routes from "../../../routes";

type menuItemTypes = 'Dashboard'
  | 'Clients'
  | 'Services'

interface DrawerMenuItemsProps {

}

const DrawerMenuItems: FC<DrawerMenuItemsProps> = () => {

  const menuItems: ({ text: menuItemTypes, icon: JSX.Element, route: string })[] = [
    {
      text: 'Dashboard',
      icon: <DashboardOutlinedIcon/>,
      route: routes.dashboardPage
    },
    {
      text: 'Clients',
      icon: <BusinessOutlinedIcon/>,
      route: routes.clientsPage
    },
    {
      text: 'Services',
      icon: <CleaningServicesOutlinedIcon/>,
      route: '' //TODO: Implement in the future
    }
  ];

  return (
    <Box
      role='presentation'
      sx={{width: 400}}
    >
      <List>
        {menuItems.map(item =>
          <ListItem
            key={item.text}
            component={Link}
            to={item.route}
            sx={{
              color: 'black'
            }}
            disablePadding
          >
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