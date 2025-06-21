import { createTheme } from "@mui/material";

export const theme = createTheme({
    palette: {
        primary: {
            main: '#00DE90',
        },
        background: {
            default: '#00DE90',
            paper: 'rgba(0, 0, 0, 0.8)',
        },
        text: {
            primary: '#FFFFFF',
            secondary: '#000000',
        },
    },
});

export const COLORS = {
    PRIMARY: '#00DE90',
    BLACK: '#000000',
    WHITE: '#FFFFFF',
} as const;
