import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import PeopleIcon from '@mui/icons-material/People';
import {BedroomChild, OtherHouses, Security} from "@mui/icons-material";

export const mainListItems = (setDataType) => (
    <React.Fragment>
        {/*<ListItemButton onClick={() => setDataType("students")}>*/}
        {/*    <ListItemIcon>*/}
        {/*        <DashboardIcon/>*/}
        {/*    </ListItemIcon>*/}
        {/*    <ListItemText primary="Dashboard"/>*/}
        {/*</ListItemButton>*/}
        <ListItemButton onClick={() => setDataType("students")}>
            <ListItemIcon>
                <PeopleIcon/>
            </ListItemIcon>
            <ListItemText primary="Students"/>
        </ListItemButton>
        <ListItemButton onClick={() => setDataType("students-clearance")}>
            <ListItemIcon>
                <PeopleIcon/>
            </ListItemIcon>
            <ListItemText primary="Clearance"/>
        </ListItemButton>
        <ListItemButton onClick={() => setDataType("hostels")}>
            <ListItemIcon>
                <OtherHouses/>
            </ListItemIcon>
            <ListItemText primary="Hostels"/>
        </ListItemButton>
        <ListItemButton onClick={() => setDataType("rooms")}>
            <ListItemIcon>
                <BedroomChild/>
            </ListItemIcon>
            <ListItemText primary="Rooms"/>
        </ListItemButton>
    </React.Fragment>
);

export const secondaryListItems = (setDataType) => (
    <React.Fragment>
        <ListSubheader component="div">
            Management
        </ListSubheader>
        <ListItemButton onClick={() => setDataType("admins")}>
            <ListItemIcon>
                <Security/>
            </ListItemIcon>
            <ListItemText primary="Admins"/>
        </ListItemButton>
    </React.Fragment>
);