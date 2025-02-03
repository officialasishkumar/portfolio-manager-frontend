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
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import NavBar from "../components/NavBar";
import api from "../services/api";

export default function Orders() {
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [security, setSecurity] = useState("");
    const [qty, setQty] = useState("");
    const [loading, setLoading] = useState(true); // <-- Loader state

    // State for editing an order (only quantity can be changed)
    const [editingOrderId, setEditingOrderId] = useState(null);
    const [editingQty, setEditingQty] = useState("");

    // State for executing an order
    const [executingOrderId, setExecutingOrderId] = useState(null);
    const [execQty, setExecQty] = useState("");

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
        } finally {
            setLoading(false); // Stop loader
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

    // Amend order: only allow updating the quantity.
    const handleUpdateOrder = async (orderId) => {
        try {
            const res = await api.put(`/orders/${orderId}`, {
                qty: parseInt(editingQty),
            });
            setOrders((prev) =>
                prev.map((o) => (o.id === orderId ? res.data : o))
            );
            setEditingOrderId(null);
            setEditingQty("");
        } catch (error) {
            alert(error.response?.data?.detail || "Error amending order");
        }
    };

    // Cancel order (using DELETE endpoint)
    const handleCancelOrder = async (orderId) => {
        try {
            const res = await api.delete(`/orders/${orderId}`);
            setOrders((prev) =>
                prev.map((o) => (o.id === orderId ? res.data : o))
            );
        } catch (error) {
            alert(error.response?.data?.detail || "Error cancelling order");
        }
    };

    // Execute order: POST to execute endpoint
    const handleExecute = async (orderId) => {
        try {
            const res = await api.post(`/orders/${orderId}/execute`, {
                executed_qty: parseInt(execQty),
            });
            setOrders((prev) =>
                prev.map((o) => (o.id === orderId ? res.data : o))
            );
            setExecutingOrderId(null);
            setExecQty("");
        } catch (error) {
            alert(error.response?.data?.detail || "Error executing order");
        }
    };

    // Render a status badge with colors for each status.
    const getStatusBadge = (status) => {
        let color = "default";
        if (status === "executed") color = "success";
        else if (status === "pending") color = "warning";
        else if (status === "partial") color = "info";
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
                        <Typography
                            variant="h4"
                            gutterBottom
                            align="center"
                            sx={{ fontWeight: "bold" }}
                        >
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
                                        sx={{ borderRadius: 2 }}
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

                    {/* Loader or Order Cards */}
                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                            {orders.length === 0 ? (
                                <Grid item xs={12}>
                                    <Typography variant="h6" align="center">
                                        No orders to display.
                                    </Typography>
                                </Grid>
                            ) : (
                                orders.map((order) => (
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
                                            {editingOrderId === order.id ? (
                                                // Inline edit form for amending the order quantity.
                                                <Box
                                                    component="form"
                                                    onSubmit={(e) => {
                                                        e.preventDefault();
                                                        handleUpdateOrder(order.id);
                                                    }}
                                                >
                                                    <Typography
                                                        variant="h6"
                                                        sx={{ fontWeight: "bold", mb: 1 }}
                                                    >
                                                        Amend Order Quantity
                                                    </Typography>
                                                    <TextField
                                                        label="New Quantity"
                                                        type="number"
                                                        value={editingQty}
                                                        onChange={(e) => setEditingQty(e.target.value)}
                                                        required
                                                        fullWidth
                                                        sx={{ mb: 2 }}
                                                    />
                                                    <Box sx={{ display: "flex", gap: 2 }}>
                                                        <Button
                                                            type="submit"
                                                            variant="contained"
                                                            color="primary"
                                                            sx={{ flex: 1 }}
                                                        >
                                                            Save
                                                        </Button>
                                                        <Button
                                                            variant="outlined"
                                                            color="secondary"
                                                            sx={{ flex: 1 }}
                                                            onClick={() => {
                                                                setEditingOrderId(null);
                                                                setEditingQty("");
                                                            }}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            ) : (
                                                // Display order details with action buttons.
                                                <Box>
                                                    <Typography
                                                        variant="h6"
                                                        sx={{ fontWeight: "bold", mb: 1 }}
                                                    >
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
                                                        <strong>Pending Qty:</strong>{" "}
                                                        {order.original_qty - order.executed_qty}
                                                    </Typography>
                                                    <Box
                                                        sx={{
                                                            mt: 2,
                                                            display: "flex",
                                                            gap: 2,
                                                            flexWrap: "wrap",
                                                        }}
                                                    >
                                                        {order.status !== "executed" &&
                                                            order.status !== "cancelled" && (
                                                                <>
                                                                    <Button
                                                                        variant="outlined"
                                                                        color="primary"
                                                                        onClick={() => {
                                                                            setEditingOrderId(order.id);
                                                                            setEditingQty(order.original_qty);
                                                                        }}
                                                                    >
                                                                        Amend
                                                                    </Button>
                                                                    <Button
                                                                        variant="outlined"
                                                                        color="error"
                                                                        onClick={() => handleCancelOrder(order.id)}
                                                                    >
                                                                        Cancel Order
                                                                    </Button>
                                                                    <Button
                                                                        variant="outlined"
                                                                        color="secondary"
                                                                        onClick={() =>
                                                                            setExecutingOrderId(order.id)
                                                                        }
                                                                    >
                                                                        Execute
                                                                    </Button>
                                                                </>
                                                            )}
                                                    </Box>
                                                </Box>
                                            )}
                                        </Paper>
                                    </Grid>
                                ))
                            )}
                        </Grid>
                    )}

                    {/* Execute Order Dialog */}
                    <Dialog
                        open={Boolean(executingOrderId)}
                        onClose={() => setExecutingOrderId(null)}
                    >
                        <DialogTitle>Execute Order</DialogTitle>
                        <DialogContent>
                            <TextField
                                label="Execution Quantity"
                                type="number"
                                fullWidth
                                margin="normal"
                                value={execQty}
                                onChange={(e) => setExecQty(e.target.value)}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setExecutingOrderId(null)}>Cancel</Button>
                            <Button
                                onClick={() => {
                                    if (executingOrderId) {
                                        handleExecute(executingOrderId);
                                    }
                                }}
                            >
                                Submit
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            </Box>
        </>
    );
}
