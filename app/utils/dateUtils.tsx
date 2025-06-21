import { Stack, Typography } from "@mui/material";
import ArrowDropDownSharpIcon from '@mui/icons-material/ArrowDropDownSharp';

export const formatDateRange = (dateString: string) => {
    // 「〜」区切りの日付文字列を分割
    const dateParts = dateString.split('～');
    if (dateParts.length !== 2) {
        return <span>{dateString}</span>; // フォーマットが不正な場合はそのまま表示
    } else {
        // 開始と終了を3行で表示
        return (
            <Stack direction="column" spacing={-1} alignItems="center" justifyContent="center">
                <Typography variant="h6">{dateParts[0].trim()}</Typography>
                <ArrowDropDownSharpIcon fontSize="large" />
                <Typography variant="h6">{dateParts[1].trim()}</Typography>
            </Stack>
        );
    }
};
