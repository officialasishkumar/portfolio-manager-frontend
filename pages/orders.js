import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Grid,
    Paper,
    Chip,
} from "@mui/material";
import NavBar from "../components/NavBar";
import OrderCard from "../components/OrderCard";
import api from "../services/api";

export default function Orders() {
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [security, setSecurity] = useState("");
    const [qty, setQty] = useState("");

    const fetchOrders = async () => {
        try {
            const res = await api.get("/orders");
            setOrders(res.data);
        } catch (error) {
            if (error.response?.status === 401) {
                router.push("/login");
            } else {
                alert("Error fetching orders");
            }
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleCreateOrder = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/orders", {
                security,
                qty: parseInt(qty),
            });
            setOrders((prev) => [res.data, ...prev]);
            setSecurity("");
            setQty("");
        } catch (error) {
            alert(error.response?.data?.detail || "Error placing order");
        }
    };

    // Function to add status badges
    const getStatusBadge = (status) => {
        let color = "default";
        if (status === "executed") color = "success";
        else if (status === "pending") color = "warning";
        else if (status === "cancelled") color = "error";
        return <Chip label={status.toUpperCase()} color={color} />;
    };

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
                <Container maxWidth="lg">
                    {/* Order Form */}
                    <Paper
                        elevation={6}
                        sx={{
                            p: 4,
                            mb: 4,
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            borderRadius: 3,
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                        }}
                    >
                        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: "bold" }}>
                            Orders Dashboard
                        </Typography>
                        <Box component="form" onSubmit={handleCreateOrder} sx={{ mb: 3 }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        label="Security"
                                        value={security}
                                        onChange={(e) => setSecurity(e.target.value)}
                                        required
                                        fullWidth
                                        variant="outlined"
                                        sx={{
                                            borderRadius: 2,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        label="Quantity"
                                        type="number"
                                        value={qty}
                                        onChange={(e) => setQty(e.target.value)}
                                        required
                                        fullWidth
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        sx={{
                                            fontWeight: "bold",
                                            py: 1.5,
                                            borderRadius: 2,
                                            background: "#1565C0",
                                            "&:hover": { background: "#0D47A1" },
                                        }}
                                    >
                                        PLACE ORDER
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>

                    {/* Order Cards */}
                    <Grid container spacing={3}>
                        {orders.map((order) => (
                            <Grid item xs={12} md={6} key={order.id}>
                                <Paper
                                    elevation={4}
                                    sx={{
                                        p: 3,
                                        borderRadius: 3,
                                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                                    }}
                                >
                                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                                        Security: {order.security}
                                    </Typography>
                                    {getStatusBadge(order.status)}
                                    <Typography sx={{ fontSize: "1.1rem", mt: 1 }}>
                                        <strong>Original Qty:</strong> {order.original_qty}
                                    </Typography>
                                    <Typography sx={{ fontSize: "1.1rem" }}>
                                        <strong>Executed Qty:</strong> {order.executed_qty}
                                    </Typography>
                                    <Typography sx={{ fontSize: "1.1rem" }}>
                                        <strong>Pending Qty:</strong> {order.pending_qty}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
        </>
    );
}
