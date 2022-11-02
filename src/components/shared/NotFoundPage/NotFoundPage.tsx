import React, {FC} from 'react';
import NotFoundImage from "./page-not-found.svg";
import styles from './NotFoundPage.module.scss';
import {Box, Button, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import routes from "../../../routes";

interface NotFoundPageProps {
}

const NotFoundPage: FC<NotFoundPageProps> = () => (
  <Box
    className={styles.NotFoundPage}
    data-testid="NotFoundPage"
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}
  >
    <Box margin={5}>
      <Typography variant={"h1"} color={'primary'}>
        Whoops!
      </Typography>
      <Typography variant={"h2"} color={'secondary'}>
        The page you are looking for was not found
      </Typography>
    </Box>
    <Box margin={5}>
      <img
        src={NotFoundImage}
        alt="Not found"
        width="400"
        height="400"
      />
    </Box>
    <Box margin={5}>
      <Button
        variant={'contained'}
        component={Link}
        to={routes.dashboardPage}
      >
        Back to Dashboard
      </Button>
    </Box>

  </Box>
);

export default NotFoundPage;
