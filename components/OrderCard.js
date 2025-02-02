import React, { useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    CardActions,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions
} from "@mui/material";
import api from "../services/api";

const OrderCard = ({ order, onUpdate }) => {
    const [openAmend, setOpenAmend] = useState(false);
    const [openExecute, setOpenExecute] = useState(false);
    const [amendQty, setAmendQty] = useState(order.original_qty);
    const [execQty, setExecQty] = useState(0);

    const handleAmend = async () => {
        try {
            const res = await api.put(`/orders/${order.id}`, { qty: parseInt(amendQty) });
            onUpdate(res.data);
            setOpenAmend(false);
        } catch (error) {
            alert(error.response.data.detail || "Error amending order");
        }
    };

    const handleCancel = async () => {
        try {
            const res = await api.delete(`/orders/${order.id}`);
            onUpdate(res.data);
        } catch (error) {
            alert(error.response.data.detail || "Error cancelling order");
        }
    };

    const handleExecute = async () => {
        try {
            const res = await api.post(`/orders/${order.id}/execute`, { executed_qty: parseInt(execQty) });
            onUpdate(res.data);
            setOpenExecute(false);
        } catch (error) {
            alert(error.response.data.detail || "Error executing order");
        }
    };

    return (
        <>
            <Card sx={{ marginBottom: 2 }}>
                <CardContent>
                    <Typography variant="h6">Security: {order.security}</Typography>
                    <Typography>Original Qty: {order.original_qty}</Typography>
                    <Typography>Executed Qty: {order.executed_qty}</Typography>
                    <Typography>Status: {order.status}</Typography>
                    <Typography>Pending Qty: {order.pending_qty}</Typography>
                </CardContent>
                <CardActions>
                    {order.status !== "cancelled" && order.status !== "executed" && (
                        <>
                            <Button size="small" onClick={() => setOpenAmend(true)}>
                                Amend
                            </Button>
                            <Button size="small" onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button size="small" onClick={() => setOpenExecute(true)}>
                                Execute
                            </Button>
                        </>
                    )}
                </CardActions>
            </Card>

            {/* Amend Dialog */}
            <Dialog open={openAmend} onClose={() => setOpenAmend(false)}>
                <DialogTitle>Amend Order</DialogTitle>
                <DialogContent>
                    <TextField
                        label="New Quantity"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={amendQty}
                        onChange={(e) => setAmendQty(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAmend(false)}>Cancel</Button>
                    <Button onClick={handleAmend}>Submit</Button>
                </DialogActions>
            </Dialog>

            {/* Execute Dialog */}
            <Dialog open={openExecute} onClose={() => setOpenExecute(false)}>
                <DialogTitle>Execute Order</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Execution Qty"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={execQty}
                        onChange={(e) => setExecQty(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenExecute(false)}>Cancel</Button>
                    <Button onClick={handleExecute}>Submit</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default OrderCard;
