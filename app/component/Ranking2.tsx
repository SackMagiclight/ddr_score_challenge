import {
    createTheme,
    SxProps,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Theme,
    ThemeProvider,
    useMediaQuery,
    useTheme
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
                },
                body: {
                    color: '#FFFFFF',
                    backgroundColor: '#0A2D1D',
                    fontSize: '1rem',
                    whiteSpace: 'nowrap',
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        transition: 'background 0.3s ease',
                    },
                },
            },
        },
    },
});

const getColStyleFromIndex = (index: number): SxProps<Theme> => {
    switch (index) {
        case 0:
            return { textAlign: 'right' };
        default:
            return {};
    }
}

export const Ranking2 = ({header, dataRow}: RankingProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <ThemeProvider theme={tableTheme}>
            <TableContainer sx={{ maxHeight: 'calc(100vh - 200px)' }}>
                <Table size="small" stickyHeader aria-label="ranking table">
                    <TableHead>
                        <TableRow>
                            {header.map((header, index) => {
                                if (index > 2 && isMobile) {
                                    return null; // モバイルでは3列目以降を非表示
                                } else {
                                    return (
                                        <TableCell sx={{
                                            ...getColStyleFromIndex(index),
                                            ...{ "paddingLeft": "6px", "paddingRight": "6px", },
                                            ...{ '&:last-child td, &:last-child th': { border: 0 } }
                                        }} key={index}>{header}</TableCell>
                                    )
                                }
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataRow.map((row, index) => (
                            <TableRow key={index}>
                                <>{row.map((c, index2) => {
                                    if (index2 > 2 && isMobile) {
                                        return null; // モバイルでは3列目以降を非表示
                                    } else {
                                        return (
                                            <TableCell  sx={{
                                    ...getColStyleFromIndex(index2),
                                    ...{ "paddingLeft": "6px", "paddingRight": "6px", },
                                    ...{ '&:last-child td, &:last-child th': { border: 0 } }
                                }} key={index2}>{c}</TableCell>
                                        )
                                    }
                                })}</>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </ThemeProvider>
    )
}