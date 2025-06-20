import {
    Box,
    createTheme,
    Stack,
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

function getStickyCellStyle(width: number, zIndex: number, left: number) {
    return {
        position: "sticky",
        left: left,
        width: width,
        zIndex: zIndex,
    };
}

const getStickyCellStyleFromRowNumber = (rowNumber: number, isCol: boolean) => {
    switch (rowNumber) {
        case 0:
            return getStickyCellStyle(30, 100 - (isCol ? 1 : 0), 0);
        case 1:
            return getStickyCellStyle(120, 100 - (isCol ? 1 : 0), 30);
        case 2:
            return getStickyCellStyle(130, 100 - (isCol ? 1 : 0), 124);
        default:
            return {};
    }
}

const getColStyleFromIndex = (index: number): SxProps<Theme> => {
    switch (index) {
        case 0:
            return { textAlign: 'center' };
        case 2:
            return { textAlign: 'center', fontWeight: 'bold' };
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
            <TableContainer sx={{ maxHeight: 'calc(100vh - 200px)' }}>
                <Table size="small" stickyHeader aria-label="ranking table">
                    <TableHead>
                        <TableRow>
                            {
                                [0].map((index) => {
                                    const order = header[0];
                                    const name = header[1];
                                    const total = header[2];
                                    return (<TableCell sx={{
                                        ...(isMobile ? getStickyCellStyleFromRowNumber(index, false) : {}),
                                        ...getColStyleFromIndex(index),
                                        ...{ "paddingLeft": "6px", "paddingRight": "6px", }
                                    }} key={index}><Stack direction="row" spacing={0} alignItems="start" width={"100%"}>
                                            <Box sx={{ width: "30px" }} >{order}</Box>
                                            <Box sx={isMobile ? { width: "100px" } : { flexGrow: 1 }} >{name}</Box>
                                            <Box sx={{ width: "70px" }} >{total}</Box>
                                        </Stack></TableCell>)
                                })
                            }
                            {indexSet.map((indexes, index) => {
                                const h = header[indexes[0]];
                                const centerStyle = indexes.length > 1 ? { textAlign: 'center' } : {};
                                return (
                                    <TableCell sx={{
                                        ...centerStyle,
                                        ...{ "paddingLeft": "6px", "paddingRight": "6px", }
                                    }} key={index}>{h}</TableCell>
                                )

                            })}
                            {
                                [datetimeColIndex].map((index) => {
                                    const h = header[index];
                                    return (<TableCell sx={{
                                        ...(isMobile ? getStickyCellStyleFromRowNumber(index, false) : {}),
                                        ...getColStyleFromIndex(index),
                                        ...{ "paddingLeft": "6px", "paddingRight": "6px", }
                                    }} key={index}>{h}</TableCell>)
                                })
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataRow.map((row, index) => (
                            <TableRow key={index}>
                                <>
                                    {
                                        [0].map((index) => {
                                            const order = row[0];
                                            const name = row[1];
                                            const total = row[2];
                                            const centerStyle = index === 2 ? { textAlign: 'center' } : {};
                                            return (<TableCell sx={{
                                                ...(isMobile ? getStickyCellStyleFromRowNumber(index, true) : {}),
                                                ...getColStyleFromIndex(index),
                                                ...{ "paddingLeft": "6px", "paddingRight": "6px", },
                                                ...{ '&:last-child td, &:last-child th': { border: 0 } }
                                            }} key={index}>
                                                <Stack direction="row" spacing={0} alignItems="start" width={"100%"}>
                                                    <Box sx={{ width: "30px" }} >{order}</Box>
                                                    <Box sx={isMobile ? { width: "100px" } : { flexGrow: 1 }} >{name}</Box>
                                                    <Box sx={{ width: "70px" }} >{total}</Box>
                                                </Stack>
                                            </TableCell>)
                                        })
                                    }
                                    {indexSet.map((indexes, index) => {
                                        const h1 = indexes.length === 1 ? row[indexes[0]] : `(${row[indexes[0]]})`;
                                        const h2 = indexes.length > 1 ? row[indexes[1]] : null;
                                        const centerStyle = indexes.length > 1 ? { textAlign: 'center' } : {};
                                        return (
                                            <TableCell sx={{
                                                ...{ "paddingLeft": "6px", "paddingRight": "6px", },
                                                ...centerStyle,
                                                ...{ '&:last-child td, &:last-child th': { border: 0 } }
                                            }} key={index}>
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
                                                ...(isMobile ? getStickyCellStyleFromRowNumber(index, true) : {}),
                                                ...getColStyleFromIndex(index),
                                                ...{ "paddingLeft": "6px", "paddingRight": "6px", },
                                                ...{ '&:last-child td, &:last-child th': { border: 0 } }
                                            }} key={index}>
                                                <Stack direction="column" spacing={0} alignItems="end" width={"fit-content"}>
                                                    <Box>{d.format("YYYY-MM-DD")}</Box>
                                                    <Box>{d.format("HH:mm:ss")}</Box>
                                                </Stack>
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