import {
    AppBar,
    Box,
    Tabs,
    Tab,
    Typography,
    Paper,
    Container,
    Grid,
    Card,
    CardContent,
    CardActionArea,
} from "@mui/material";
import { useState } from "react";
import "./homeStyle.css";

const events = [
    { id: 1, name: "1st", description: "Описание первого события" },
    { id: 2, name: "2nd", description: "Описание второго события" },
    { id: 3, name: "3rd", description: "Описание третьего события" },
    { id: 4, name: "4th", description: "Описание четвертого события" },
    { id: 5, name: "5th", description: "Описание пятого события" },
];

const HomePage: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleEventClick = (eventName: string) => {
        alert(`Вы выбрали событие: ${eventName}`);
    };

    return (
        <div className="homepage">
            {/* AppBar с Tabs */}
            <AppBar position="sticky" sx={{ backgroundColor: "#5e35b1", padding: 1 }}>
                <Container maxWidth="lg" sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Fastbuy
                    </Typography>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        textColor="inherit"
                        indicatorColor="secondary"
                    >
                        <Tab label="Лента" />
                        <Tab label="Купленные билеты" />
                    </Tabs>
                    <Typography variant="body1" sx={{ marginLeft: "auto" }}>
                        Имя пользователя
                    </Typography>
                </Container>
            </AppBar>

            {/* Контент */}
            <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh", padding: 2 }}>
                {activeTab === 0 && (
                    <Container maxWidth="lg">
                        <Typography variant="h4" gutterBottom sx={{ marginBottom: 3 }}>
                            Лента событий
                        </Typography>
                        <Grid container spacing={3}>
                            {events.map((event) => (
                                <Grid item xs={12} sm={6} md={4} key={event.id}>
                                    <Card>
                                        <CardActionArea onClick={() => handleEventClick(event.name)}>
                                            <CardContent>
                                                <Typography variant="h6">{event.name}</Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="textSecondary"
                                                    sx={{ marginTop: 1 }}
                                                >
                                                    {event.description}
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                )}

                {activeTab === 1 && (
                    <Container maxWidth="lg">
                        <Typography variant="h4" gutterBottom>
                            Купленные билеты
                        </Typography>
                        <Paper
                            elevation={3}
                            sx={{
                                padding: 2,
                                backgroundColor: "#ede7f6",
                                textAlign: "center",
                            }}
                        >
                            <Typography variant="body1">
                                Здесь будут отображаться купленные билеты.
                            </Typography>
                        </Paper>
                    </Container>
                )}
            </Box>
        </div>
    );
};

export default HomePage;