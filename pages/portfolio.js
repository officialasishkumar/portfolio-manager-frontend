import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
    Container,
    Typography,
    Box,
    List,
    ListItem,
    ListItemText
} from "@mui/material";
import NavBar from "../components/NavBar";
import api from "../services/api";

export default function Portfolio() {
    const router = useRouter();
    const [portfolio, setPortfolio] = useState([]);

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
        }
    };

    useEffect(() => {
        fetchPortfolio();
    }, []);

    return (
        <>
            <NavBar />
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Portfolio
                </Typography>
                {portfolio.length === 0 ? (
                    <Typography>No executed orders to display.</Typography>
                ) : (
                    <Box>
                        <List>
                            {portfolio.map((item, index) => (
                                <ListItem key={index}>
                                    <ListItemText primary={item.security} secondary={`Qty: ${item.qty}`} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}
            </Container>
        </>
    );
}
