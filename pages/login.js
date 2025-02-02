import { useState } from "react";
import { useRouter } from "next/router";
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Link as MuiLink
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
            const res = await api.post("/login", { username, password }, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                transformRequest: [(data) => {
                    // Convert JSON data to URL-encoded string (OAuth2PasswordRequestForm)
                    return `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
                }],
            });
            localStorage.setItem("access_token", res.data.access_token);
            router.push("/orders");
        } catch (error) {
            alert(error.response?.data?.detail || "Login failed");
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ marginTop: 8 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Login
                </Typography>
                <form onSubmit={handleSubmit}>
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
                </form>
                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                    Don't have an account?{" "}
                    <Link href="/register" passHref>
                        <MuiLink>Register</MuiLink>
                    </Link>
                </Typography>
            </Box>
        </Container>
    );
}
