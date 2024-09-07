import * as React from 'react';
import Box from "@mui/material/Box";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Typography from '@mui/material/Typography';


export default function Ranking({rankedUsers}) {
    return (
      <Box display={"flex"} flexDirection={"column"} alignItems={"center"} marginLeft={"1rem"}>
      <Typography variant="h5">Current Ranking</Typography>
      <List sx={{ width: "25vw", bgcolor: 'gray' }}>
        {rankedUsers.map((user, index) => (
          <ListItem alignItems="flex-start" sx={{ padding: '0px' }} key={user.userId}>
            <ListItemAvatar sx={{ height: '50px', alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
              <Typography variant='h4'>{index + 1}</Typography>
            </ListItemAvatar>
            <ListItemText
              primary={`User ID: ${user.userId}`}
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ color: 'text.primary', display: 'inline' }}
                  >
                    Points: 
                  </Typography>
                  {" "}{user.points}
                </React.Fragment>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>    );
}
