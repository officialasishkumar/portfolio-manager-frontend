import { useState } from "react";
import { useRouter } from "next/router";
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Paper,
} from "@mui/material";
import Link from "next/link";
import api from "../services/api";

export default function Login() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post(
                "/login",
                { username, password },
                {
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    transformRequest: [
                        () =>
                            `username=${encodeURIComponent(username)}&password=${encodeURIComponent(
                                password
                            )}`,
                    ],
                }
            );
            localStorage.setItem("access_token", res.data.access_token);
            router.push("/orders");
        } catch (error) {
            alert(error.response?.data?.detail || "Login failed");
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundImage: 'url("/images/login-bg.jpg")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                // Optional subtle animation (you can define this keyframes in your global CSS)
                animation: "backgroundAnimation 20s infinite alternate",
            }}
        >
            <Container maxWidth="sm">
                <Paper elevation={6} sx={{ padding: 4, opacity: 0.95 }}>
                    <Typography variant="h4" component="h1" gutterBottom align="center">
                        Login
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            label="Username"
                            fullWidth
                            margin="normal"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                            Login
                        </Button>
                    </Box>
                    <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                        Don't have an account?{" "}
                        <Link href="/register" passHref>
                            <Button variant="text">Register</Button>
                        </Link>
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
}
