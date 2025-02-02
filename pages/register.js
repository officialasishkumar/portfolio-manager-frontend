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
        <Container maxWidth="sm">
            <Box sx={{ marginTop: 8 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Register
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
                        Register
                    </Button>
                </form>
                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                    Already have an account?{" "}
                    <Link href="/login" passHref>
                        <MuiLink>Login</MuiLink>
                    </Link>
                </Typography>
            </Box>
        </Container>
    );
}
