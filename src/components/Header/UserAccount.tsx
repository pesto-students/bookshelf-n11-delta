import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {useState} from 'react';

import {useAppSelector} from '../../redux';
import {MenuItems} from './MenuItems';

export const UserAccount = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItems = MenuItems();
  const currentUser = useAppSelector(state => state.auth.user);

  const username = currentUser?.username;
  return (
    <>
      <Box sx={{display: 'flex', alignItems: 'center', textAlign: 'center'}}>
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ml: 2}}
          aria-label="user-avatar"
        >
          <Avatar sx={{width: 28, height: 28}}>
            {currentUser?.username ? username.slice(0, 1) : null}
          </Avatar>
        </IconButton>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
      >
        {menuItems.map(
          menuItem =>
            menuItem.show && (
              <MenuItem
                key={menuItem.id}
                disabled={!!menuItem.disable}
                onClick={menuItem.onClick}
              >
                <ListItemIcon>{menuItem.icon}</ListItemIcon>
                {menuItem.title}
              </MenuItem>
            ),
        )}
      </Menu>
    </>
  );
};
