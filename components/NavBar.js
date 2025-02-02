import React from "react";
import Link from "next/link";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useRouter } from "next/router";

const NavBar = () => {
    const router = useRouter();

    const handleLogout = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("access_token");
            router.push("/login");
        }
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Mock Exchange
                </Typography>
                <Link href="/orders" passHref>
                    <Button color="inherit">Orders</Button>
                </Link>
                <Link href="/portfolio" passHref>
                    <Button color="inherit">Portfolio</Button>
                </Link>
                <Button color="inherit" onClick={handleLogout}>
                    Logout
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
