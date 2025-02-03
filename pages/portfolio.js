import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
    Container,
    Typography,
    Box,
    Grid,
    Paper,
    CircularProgress,
} from "@mui/material";
import NavBar from "../components/NavBar";
import api from "../services/api";

export default function Portfolio() {
    const router = useRouter();
    const [portfolio, setPortfolio] = useState([]);
    const [loading, setLoading] = useState(true); // <-- Loader state

    const fetchPortfolio = async () => {
        try {
            const res = await api.get("/portfolio");
            setPortfolio(res.data);
        } catch (error) {
            if (error.response?.status === 401) {
                router.push("/login");
            } else {
                alert("Error fetching portfolio");
            }
        } finally {
            setLoading(false); // Stop loader whether success or error
        }
    };

    useEffect(() => {
        fetchPortfolio();
    }, []);

    return (
        <>
            <NavBar />
            <Box
                sx={{
                    minHeight: "calc(100vh - 64px)",
                    backgroundImage: 'url("/images/login-bg.jpg")',
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    py: 4,
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Container maxWidth="md">
                    {/* Portfolio Title Section */}
                    <Paper
                        elevation={6}
                        sx={{
                            p: 4,
                            mb: 4,
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            borderRadius: 3,
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                            textAlign: "center",
                        }}
                    >
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
                            Portfolio
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            Your executed orders and holdings
                        </Typography>
                    </Paper>

                    {/* Loader or Portfolio Holdings */}
                    {loading ? (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                mt: 4,
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                            {portfolio.length === 0 ? (
                                <Grid item xs={12}>
                                    <Paper
                                        elevation={4}
                                        sx={{
                                            p: 3,
                                            textAlign: "center",
                                            borderRadius: 3,
                                            backgroundColor: "rgba(255, 255, 255, 0.95)",
                                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                        }}
                                    >
                                        <Typography variant="h6" color="textSecondary">
                                            No executed orders to display.
                                        </Typography>
                                    </Paper>
                                </Grid>
                            ) : (
                                portfolio.map((item, index) => (
                                    <Grid item xs={12} md={6} key={index}>
                                        <Paper
                                            elevation={4}
                                            sx={{
                                                p: 3,
                                                borderRadius: 3,
                                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                                backgroundColor: "rgba(255, 255, 255, 0.95)",
                                            }}
                                        >
                                            <Typography
                                                variant="h6"
                                                sx={{ fontWeight: "bold", mb: 1 }}
                                            >
                                                {item.security}
                                            </Typography>
                                            <Typography sx={{ fontSize: "1.1rem" }}>
                                                <strong>Quantity:</strong> {item.qty}
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                ))
                            )}
                        </Grid>
                    )}
                </Container>
            </Box>
        </>
    );
}
