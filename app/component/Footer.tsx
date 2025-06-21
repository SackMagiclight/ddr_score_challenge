import { Box, Link, Typography } from "@mui/material";

export const Footer = () => {
    return (
        <Box sx={{ m: 4 }}>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                主催：TAKA.S |{' '}
                <Link
                    href="https://x.com/takas_kzn"
                    target="_blank"
                    color="primary"
                    sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                >
                    Xで連絡
                </Link>
            </Typography>
        </Box>
    );
};
