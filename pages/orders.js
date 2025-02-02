import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Divider
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
            const res = await api.post("/orders", { security, qty: parseInt(qty) });
            setOrders((prev) => [res.data, ...prev]);
            setSecurity("");
            setQty("");
        } catch (error) {
            alert(error.response?.data?.detail || "Error placing order");
        }
    };

    // Update a single order in the list after amend, cancel, or execution
    const updateOrder = (updated) => {
        setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    };

    return (
        <>
            <NavBar />
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Orders
                </Typography>
                <Box component="form" onSubmit={handleCreateOrder} sx={{ mb: 4 }}>
                    <Typography variant="h6">Place New Order</Typography>
                    <TextField
                        label="Security"
                        value={security}
                        onChange={(e) => setSecurity(e.target.value)}
                        required
                        sx={{ mr: 2 }}
                    />
                    <TextField
                        label="Quantity"
                        type="number"
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                        required
                        sx={{ mr: 2, width: "150px" }}
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Submit
                    </Button>
                </Box>
                <Divider sx={{ mb: 2 }} />
                {orders.map((order) => (
                    <OrderCard key={order.id} order={order} onUpdate={updateOrder} />
                ))}
            </Container>
        </>
    );
}
