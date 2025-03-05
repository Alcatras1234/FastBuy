import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    typography: {
        fontFamily: `"Noto Sans", sans-serif`,
    },
    palette: {
        primary: {
            main: "#3D6D56", // ✅ Dark Green
        },
        secondary: {
            main: "#C7C7C7", // ✅ Light Grey
        },
        background: {
            default: "#F5F5F5", // ✅ Light grey background
            paper: "#FFFFFF", // ✅ White paper elements
        },
        text: {
            primary: "#222222", // ✅ Black text
            secondary: "#3D6D56", // ✅ Green text
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: "8px",
                    textTransform: "none",
                    padding: "10px 20px",
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: "12px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                },
            },
        },
    },
});