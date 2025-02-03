// File: ./components/NavBar.js
import React, { useState } from "react";
import Link from "next/link";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/router";

const NavBar = () => {
    const router = useRouter();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleLogout = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("access_token");
            router.push("/login");
        }
    };

    const toggleDrawer = (open) => (event) => {
        if (
            event &&
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return;
        }
        setDrawerOpen(open);
    };

    const menuItems = [
        { text: "Orders", href: "/orders" },
        { text: "Portfolio", href: "/portfolio" },
    ];

    return (
        <>
            <AppBar position="static" sx={{ background: "#0D47A1" }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
                        Mock Exchange
                    </Typography>
                    {/* Desktop Buttons */}
                    <Box sx={{ display: { xs: "none", md: "flex" } }}>
                        {menuItems.map((item) => (
                            <Link key={item.text} href={item.href} passHref legacyBehavior>
                                <Button
                                    sx={{
                                        color: "#ffffff",
                                        marginRight: 2,
                                        textTransform: "none",
                                        fontSize: "1rem",
                                    }}
                                >
                                    {item.text}
                                </Button>
                            </Link>
                        ))}
                        <Button
                            onClick={handleLogout}
                            sx={{
                                color: "#ffffff",
                                textTransform: "none",
                                fontSize: "1rem",
                            }}
                        >
                            Logout
                        </Button>
                    </Box>
                    {/* Mobile Hamburger */}
                    <Box sx={{ display: { xs: "flex", md: "none" } }}>
                        <IconButton color="inherit" onClick={toggleDrawer(true)}>
                            <MenuIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {/* Mobile Drawer */}
            <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                <Box
                    sx={{ width: 250 }}
                    role="presentation"
                    onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}
                >
                    <List>
                        {menuItems.map((item) => (
                            <Link key={item.text} href={item.href} passHref legacyBehavior>
                                <ListItem button>
                                    <ListItemText primary={item.text} />
                                </ListItem>
                            </Link>
                        ))}
                        <ListItem button onClick={handleLogout}>
                            <ListItemText primary="Logout" />
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
        </>
    );
};

export default NavBar;
