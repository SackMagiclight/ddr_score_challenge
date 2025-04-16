import {
    createTheme,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    ThemeProvider
} from "@mui/material";

export type RankingProps = {
    header: string[]; dataRow: string[][];
}

const tableTheme = createTheme({
    components: {
        MuiTableCell: {
            styleOverrides: {
                head: {
                    backgroundColor: '#00DE90',
                    color: '#000000',
                    fontFamily: 'Montserrat, sans-serif',
                    lineHeight: '0.8rem',
                    whiteSpace: 'pre-wrap',
                },
                body: {
                    color: '#FFFFFF',
                    fontSize: '1rem',
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&:nth-of-type(even)': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        transition: 'background 0.3s ease',
                    },
                },
            },
        },
    },
});

export const Ranking = ({header, dataRow}: RankingProps) => {
    return (
        <ThemeProvider theme={tableTheme}>
            <TableContainer>
                <Table sx={{minWidth: 650}} aria-label="ranking table">
                    <TableHead>
                        <TableRow>
                            {header.map((header, index) => (<TableCell key={index}>{header}</TableCell>))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataRow.map((row, index) => (
                            <TableRow key={index}>
                                <>{row.map((c, index2) => (<TableCell key={index2}>{c}</TableCell>))}</>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </ThemeProvider>
    )
}