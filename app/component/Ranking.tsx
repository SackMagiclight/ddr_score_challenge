import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";

export type RankingProps = {
    header: string[]; dataRow: string[][];
}

export const Ranking = ({header, dataRow}: RankingProps) => {
    return (
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
    )
}