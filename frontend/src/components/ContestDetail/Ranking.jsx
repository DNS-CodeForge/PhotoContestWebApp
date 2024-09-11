import * as React from 'react';
import Box from "@mui/material/Box";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListSubheader from '@mui/material/ListSubheader';
import Typography from '@mui/material/Typography';

export default function Ranking({ rankedUsers }) {
    return (
        <Box
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"flex-start"}
            padding={"8px"}
            borderRadius={"12px"}
            border={"solid rgba(245, 245, 245, 0.1) 0.5px"}
            sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', width: '100%' }}
        >
            <Typography variant="h5" sx={{ color: '#FFF' }}>Current Top 5</Typography>
            <List
                sx={{ width: "100%", maxWidth: "20vw" }}
                subheader={
                    <ListSubheader
                        component="div"
                        id="nested-list-subheader"
                        sx={{
                            flexDirection: "row",
                            display: "flex",
                            justifyContent: 'space-evenly',
                            boxShadow: '0px 1px 0px rgba(245 ,245, 245, 0.1)',
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            color: "white",
                        }}
                    >
                        <Typography paddingLeft={"0.3em"}>Rank</Typography>
                        <Typography marginRight={"auto"} paddingLeft={"1.7em"}>Username</Typography>
                        <Typography marginLeft={"auto"}>Points</Typography>
                    </ListSubheader>
                }
            >
                {rankedUsers.map((user, index) => (
                    <ListItem
                        key={user.username}
                        sx={{
                            justifyContent: 'space-between',
                            boxShadow: '0px 1px 0px rgba(245, 245, 245, 0.1)',
                            backgroundColor: 'rgba(0, 0, 0, 0.4)',
                            borderRadius: '4px',
                            padding: '10px',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 165, 0, 0.1)',
                                cursor: 'pointer',
                            },
                            transition: 'background-color 0.3s ease',
                        }}
                    >
                        <Typography paddingLeft={"1em"}>{index + 1}. </Typography>
                        <Typography paddingLeft={"3em"} marginRight={"auto"}>{user.username} </Typography>
                        <Typography marginLeft={"auto"} paddingRight={"1em"}>{user.points}</Typography>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}
