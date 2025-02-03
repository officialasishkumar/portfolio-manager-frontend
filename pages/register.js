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

export default function Register() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/users", { username, password });
            alert("Registration successful! Please login.");
            router.push("/login");
        } catch (error) {
            alert(error.response?.data?.detail || "Registration failed");
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundImage: 'url("/images/register-bg.jpg")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "backgroundAnimation 20s infinite alternate",
            }}
        >
            <Container maxWidth="sm">
                <Paper elevation={6} sx={{ padding: 4, opacity: 0.95 }}>
                    <Typography variant="h4" component="h1" gutterBottom align="center">
                        Register
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
                            Register
                        </Button>
                    </Box>
                    <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                        Already have an account?{" "}
                        <Link href="/login" passHref>
                            <Button variant="text">Login</Button>
                        </Link>
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
}
