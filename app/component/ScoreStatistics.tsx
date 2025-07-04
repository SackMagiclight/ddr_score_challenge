import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useMediaQuery } from "@mui/material";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";

interface ScoreStatisticsProps {
    avarageRow: {
        [key: string]: {
            max: string;
            value: string;
        }
    }
    medianRow: {
        [key: string]: {
            max: string;
            value: string;
        }
    }
}

export const ScoreStatistics = ({ avarageRow, medianRow }: ScoreStatisticsProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
        },
    });

    // データが空の場合は何も表示しない
    if (!avarageRow || !medianRow || Object.keys(avarageRow).length === 0 || Object.keys(medianRow).length === 0) {
        return null;
    }

    // 項目名を抽出（「 平均値」「 中央値」を除去）
    const averageKeys = Object.keys(avarageRow);
    const medianKeys = Object.keys(medianRow);
    const items = averageKeys;

    const maxValue = (maxString?: string) => {
        if (!maxString) return '-';
        const value = maxString.split(" ")[1];
        return value ? parseFloat(value.replace(",", "")).toLocaleString() : 0;
    }

    return (
        <Box sx={{ mt: 3 }}>
            <Paper
                elevation={2}
                sx={{ backgroundColor: "inherit" }}
            >
                <ThemeProvider theme={tableTheme}>
                <TableContainer sx={{ backgroundColor: "inherit"}}>
                    <Table size="small" sx={{ 
                        '& .MuiTableCell-root': {
                            borderColor: theme.palette.grey[700]
                        }
                    }}>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" sx={{  backgroundColor: theme.palette.primary.main, fontSize: isMobile ? "0.6rem" : '0.875rem', whiteSpace: 'nowrap', padding: isMobile ? '4px' : '8px' }}>
                                    スコア統計
                                </TableCell>
                                {items.map((item, index) => {
                                    const title = item.replace(/平均値|中央値/g, '').trim();
                                    const maxAverage = maxValue(avarageRow[item]?.max) || '-';
                                    return (
                                        <TableCell key={item} align="center" sx={{ 
                                            color: theme.palette.text.secondary, 
                                            backgroundColor: theme.palette.primary.main,
                                            fontSize: isMobile ? "0.6rem" : '0.875rem',
                                            whiteSpace: isMobile ? 'normal' : 'nowrap', 
                                            padding: isMobile ? '4px' : '8px'
                                        }}>
                                            
                                                <span style={{"whiteSpace": "nowrap"}}>{title}</span> <span style={{"whiteSpace": "nowrap"}}>（MAX {maxAverage}）</span>
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell align="center" sx={{  color: theme.palette.common.white, fontSize: isMobile ? "0.6rem" : '1rem', whiteSpace: 'nowrap' }}>
                                    平均値
                                </TableCell>
                                {items.map((item, index) => {
                                    const averageKey = averageKeys[index];
                                    const averageData = avarageRow[averageKey];
                                    return (
                                        <TableCell key={`avg-${item}`} align="center" sx={{
                                            whiteSpace: 'nowrap',
                                            color: theme.palette.common.white,
                                            fontSize: isMobile ? "0.6rem" : '1rem',
                                        }}>
                                            <Box>{averageData?.value || '-'}</Box>
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                            <TableRow>
                                <TableCell align="center" sx={{ color: theme.palette.common.white, fontSize: isMobile ? "0.6rem" : '1rem', whiteSpace: 'nowrap' }}>
                                    中央値
                                </TableCell>
                                {items.map((item, index) => {
                                    const medianKey = medianKeys[index];
                                    const medianData = medianRow[medianKey];
                                    return (
                                        <TableCell key={`med-${item}`} align="center" sx={{
                                            whiteSpace: 'nowrap',
                                            color: theme.palette.common.white,
                                            fontSize: isMobile ? "0.6rem" : '1rem',
                                        }}>
                                            <Box>{medianData?.value || '-'}</Box>
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                </ThemeProvider>
            </Paper>
        </Box>
    );
};
