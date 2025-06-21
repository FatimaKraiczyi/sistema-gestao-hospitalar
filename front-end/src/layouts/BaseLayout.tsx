/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode, useState } from "react";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router";
import { ROUTING } from "../constants/routing";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../stores/slices/user.slice";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface BaseLayoutProps {
  children: ReactNode;
  title?: string;
  sidebarContent: ReactNode;
}

export const BaseLayout: React.FC<BaseLayoutProps> = ({
  children,
  // title,
  sidebarContent,
}) => {
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  const isAdmin = user?.type === "admin";

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    // Adicione a lógica de logout aqui
    dispatch(logOut());
    navigate(ROUTING.LOGIN);
  };

  const handleProfile = () => {
    setAnchorEl(null);
    // Navegar para a página de perfil
    navigate(ROUTING.PROFILE);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${open ? drawerWidth : 0}px)` },
          ml: { sm: `${open ? drawerWidth : 0}px` },
          transition: "width 0.2s, margin-left 0.2s",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="abrir menu lateral"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {user ? `${user.nome} ` : ""}
          </Typography>
          <div>
            <IconButton
              size="large"
              aria-label="conta do usuário atual"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              {user?.avatar ? (
                <Avatar
                  sx={{ bgcolor: "secondary.main" }}
                  src={user.avatar}
                  alt={`${user?.name ?? ""}`}
                />
              ) : (
                <Avatar sx={{ bgcolor: "secondary.main" }}>
                  <AccountCircle />
                </Avatar>
              )}
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {!isAdmin && <MenuItem onClick={handleProfile}>Perfil</MenuItem>}
              <MenuItem onClick={handleLogout}>Sair</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <Toolbar />
        {sidebarContent}
      </Drawer>
      <Main open={open}>
        <Toolbar />
        <Box component="div" sx={{ p: 2 }}>
          {children}
        </Box>
      </Main>
    </Box>
  );
};
