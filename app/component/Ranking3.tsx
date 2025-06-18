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
            return getStickyCellStyle(100, 100 - (isCol ? 1 : 0), 124);
        default:
            return {};
    }
}

const getColStyleFromIndex = (index: number): SxProps<Theme> => {
    switch (index) {
        case 0:
            return { textAlign: 'center' };
        default:
            return {};
    }
}

export const Ranking3 = ({ header, dataRow }: RankingProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const datetimeColIndex = header.findIndex((h) => h.includes("更新日時"));
    const indexSet = [] as number[][];
    for (let i = 3; i < header.length; i = i + 2) {
        if (i === datetimeColIndex) {
            indexSet.push([datetimeColIndex]);
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
                                [0, 1, 2].map((index) => {
                                    const h = header[index];
                                    return (<TableCell sx={{
                                        ...(isMobile ? getStickyCellStyleFromRowNumber(index, false) : {}),
                                        ...getColStyleFromIndex(index),
                                        ...{ "paddingLeft": "6px", "paddingRight": "6px", }
                                    }} key={index}>{h}</TableCell>)
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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataRow.map((row, index) => (
                            <TableRow key={index}>
                                <>
                                    {
                                        [0, 1, 2].map((index) => {
                                            const h = row[index];
                                            return (<TableCell sx={{
                                                ...(isMobile ? getStickyCellStyleFromRowNumber(index, true) : {}),
                                                ...getColStyleFromIndex(index),
                                                ...{ "paddingLeft": "6px", "paddingRight": "6px", },
                                                ...{ '&:last-child td, &:last-child th': { border: 0 } }
                                            }} key={index}>{h}</TableCell>)
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

                                    })} </>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </ThemeProvider>
    )
}