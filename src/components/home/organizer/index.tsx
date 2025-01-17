import React from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Grid,
    Card,
    CardContent,
} from "@mui/material";
import "./style.css"; // Переиспользуем стили пользователя

const events = [
    { id: 1, name: "1st", description: "Описание первого события" },
    { id: 2, name: "2nd", description: "Описание второго события" },
    { id: 3, name: "3rd", description: "Описание третьего события" },
    { id: 4, name: "4th", description: "Описание четвертого события" },
    { id: 5, name: "5th", description: "Описание пятого события" },
];

const OrganizerHomePage: React.FC = () => {
    return (
        <div>
            {/* Верхний бар */}
            <AppBar position="static" style={{ backgroundColor: "#673ab7" }}>
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        Fastbuy
                    </Typography>
                    <Button color="inherit">Статистика</Button>
                    <Button color="inherit">Добавить</Button>
                </Toolbar>
            </AppBar>

            {/* Содержимое страницы */}
            <Container>
                <Typography variant="h4" align="center" gutterBottom>
                    Лента событий
                </Typography>
                <Grid container spacing={2}>
                    {events.map((event) => (
                        <Grid item xs={12} sm={6} md={4} key={event.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" component="div">
                                        {event.name}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        {event.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </div>
    );
};

export default OrganizerHomePage;