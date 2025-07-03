import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

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

    // データが空の場合は何も表示しない
    if (!avarageRow || !medianRow || Object.keys(avarageRow).length === 0 || Object.keys(medianRow).length === 0) {
        return null;
    }

    // 項目名を抽出（「 平均値」「 中央値」を除去）
    const averageKeys = Object.keys(avarageRow);
    const items = averageKeys.map(key => key.replace(' 平均値', ''));

    const maxValue = (maxString: string) => {
        const value = maxString.split(" ")[1];
        return value ? parseFloat(value).toLocaleString() : 0;
    }

    return (
        <Box sx={{ mb: 3 }}>
            <Typography
                variant="h6"
                sx={{
                    color: theme.palette.primary.main,
                    fontWeight: 'bold',
                    textAlign: 'center'
                }}
            >
                スコア統計
            </Typography>

            <Paper
                elevation={2}
            >
                <TableContainer>
                    <Table size="small" sx={{ border : '1px solid', borderColor: theme.palette.grey[300] }}>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: theme.palette.grey[300], color: 'white'}}>
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: theme.palette.primary.main, color: theme.palette.common.black}}>
                                    平均値
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: theme.palette.secondary.light, color: theme.palette.common.black}}>
                                    中央値
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map((item) => {
                                const averageKey = `${item} 平均値`;
                                const medianKey = `${item} 中央値`;
                                const maxAverage = maxValue(avarageRow[averageKey]?.max) || '-';
                                const averageData = avarageRow[averageKey];
                                const avarageMaxDiff = (parseFloat(avarageRow[averageKey]?.max.split(" ")[1]) || 0) - (parseFloat(averageData?.value?.replace(/,/g, "")) || 0);
                                const medianData = medianRow[medianKey];
                                const medianMaxDiff = (parseFloat(medianRow[medianKey]?.max.split(" ")[1]) || 0) - (parseFloat(medianData?.value?.replace(/,/g, "")) || 0);

                                return (
                                    <TableRow key={item}>
                                        <TableCell align="center" sx={{ fontWeight: 'medium', backgroundColor: theme.palette.grey[50], color: theme.palette.common.black }}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: isMobile ? "0.6rem" : '1rem', }}>
                                                <Box>{item}</Box>
                                                <Box>（MAX {maxAverage || '-'}）</Box>
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center" sx={{
                                            whiteSpace: 'nowrap',
                                            fontWeight: 'bold',
                                            color: theme.palette.common.black,
                                            fontSize: isMobile ? "0.6rem" : '1rem',
                                            backgroundColor: theme.palette.primary.light,
                                        }}>
                                            <Box>{averageData?.value || '-'}</Box>
                                            <Box sx={{ fontSize: isMobile ? "0.5rem" : '0.8rem', color: theme.palette.grey[600] }}>
                                                {`MAX -${avarageMaxDiff.toLocaleString()}`}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center" sx={{
                                            whiteSpace: 'nowrap',
                                            fontWeight: 'bold',
                                            color: theme.palette.common.black,
                                            fontSize: isMobile ? "0.6rem" : '1rem',
                                            backgroundColor: "#e9baf2",
                                        }}>
                                            <Box>{medianData?.value || '-'}</Box>
                                            <Box sx={{ fontSize: isMobile ? "0.5rem" : '0.8rem', color: theme.palette.grey[600] }}>
                                                {`MAX -${medianMaxDiff.toLocaleString()}`}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};
