import {
    createTheme,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    ThemeProvider,
    useMediaQuery,
    useTheme
} from "@mui/material";
import dayjs from "dayjs";

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

const getCellLayoutStyle = (isMobile: boolean) => ({
    fontSize: isMobile ? "0.6rem" : '1rem',
    paddingLeft: isMobile ? "2px" : "6px",
    paddingRight: isMobile ? "2px" : "6px",
});

const getColStyleFromIndex = (index: number) => {
    switch (index) {
        case 0:
            return { textAlign: 'center' as const };
        case 1:
            return { textAlign: 'center' as const };
        case 2:
            return { textAlign: 'center' as const, fontWeight: 'bold' as const };
        default:
            return {};
    }
}

export const Ranking = ({ header, dataRow }: RankingProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const datetimeColIndex = header.findIndex((h) => h.includes("更新日時"));
    const indexSet = [] as number[][];
    for (let i = 3; i < header.length; i = i + 2) {
        if (i === datetimeColIndex) {
            break
        } else {
            indexSet.push([i, i + 1]);
        }
    }
    return (
        <ThemeProvider theme={tableTheme}>
            <TableContainer sx={{ maxHeight: 'calc(100vh - 200px)', overflowX: 'hidden' }}>
                <Table
                    size="small"
                    stickyHeader
                    aria-label="ranking table"
                    sx={{
                        tableLayout: 'fixed',
                        width: '100%',
                    }}
                >
                    <TableHead>
                        <TableRow>
                            {[0, 1, 2].map((index) => (
                                <TableCell sx={{
                                    ...getColStyleFromIndex(index),
                                    ...getCellLayoutStyle(isMobile),
                                }} key={index}>{header[index]}</TableCell>
                            ))}
                            {indexSet.map((indexes) => {
                                const h = header[indexes[0]];
                                return (
                                    <TableCell sx={{
                                        textAlign: 'center',
                                        ...getCellLayoutStyle(isMobile),
                                    }} key={indexes[0]}>{h}</TableCell>
                                )

                            })}
                            {
                                [datetimeColIndex].map((index) => {
                                    const h = header[index];
                                    return (<TableCell sx={{
                                        ...getColStyleFromIndex(index),
                                        textAlign: isMobile ? 'center' : 'center',
                                        ...getCellLayoutStyle(isMobile),
                                    }} key={index}>{h}</TableCell>)
                                })
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataRow.map((row, index) => (
                            <TableRow key={index}>
                                <>
                                    {[0, 1, 2].map((columnIndex) => (
                                        <TableCell sx={{
                                            ...getColStyleFromIndex(columnIndex),
                                            ...getCellLayoutStyle(isMobile),
                                        }} key={columnIndex}>{row[columnIndex]}</TableCell>
                                    ))}
                                    {indexSet.map((indexes) => {
                                        const h1 = indexes.length === 1 ? row[indexes[0]] : `(${row[indexes[0]]})`;
                                        const h2 = indexes.length > 1 ? row[indexes[1]] : null;
                                        return (
                                            <TableCell sx={{
                                                textAlign: 'center',
                                                ...getCellLayoutStyle(isMobile),
                                            }} key={indexes[0]}>
                                                <div>{h2}</div>
                                                <div>{h1}</div>
                                            </TableCell>
                                        )

                                    })}
                                    {
                                        [datetimeColIndex].map((index) => {
                                            const h = row[index];
                                            const d = dayjs(h);
                                            return (<TableCell sx={{
                                                ...getColStyleFromIndex(index),
                                                textAlign: isMobile ? 'center' : 'center',
                                                ...getCellLayoutStyle(isMobile),
                                            }} key={index}>
                                                <div>{d.format("YYYY-MM-DD")}</div>
                                                <div>{d.format("HH:mm:ss")}</div>
                                            </TableCell>)
                                        })
                                    }</>
                            </TableRow>

                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </ThemeProvider>
    )
}
