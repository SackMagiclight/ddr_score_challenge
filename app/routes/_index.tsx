import type { MetaFunction } from "@remix-run/node";
import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    createTheme,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    IconButton,
    Link,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent, Stack,
    ThemeProvider,
    Typography
} from "@mui/material";
import ArrowDropDownSharpIcon from '@mui/icons-material/ArrowDropDownSharp';
import { Ranking } from "~/component/Ranking";
import to from "await-to-js";
import { getAllSheets, getRankingSheets, RankingVM } from "~/service/sheets";

export const meta: MetaFunction = () => {
    return [
        { title: "DDR Score Challenge" },
        { description: "DDR Score Challenge" },
        {
            property: "og:title",
            content: "DDR Score Challenge",
        },
        { property: "og:description", content: "DDR Score Challenge" },
        { property: "og:image", content: "https://ddr-score-challenge.gaftalk.com/logo.png" },
        { property: "og:url", content: "https://ddr-score-challenge.gaftalk.com/" },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "DDR Score Challenge" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "DDR Score Challenge" },
        { name: "twitter:description", content: "DDR Score Challenge" },
        { name: "twitter:image", content: "https://ddr-score-challenge.gaftalk.com/logo.png" },
        { name: "twitter:site", content: "@takas_kzn" },
        { name: "twitter:creator", content: "@takas_kzn" },
    ];
};

// カスタムテーマの作成
const theme = createTheme({
    palette: {
        primary: {
            main: '#00DE90',
        },
        background: {
            default: '#00DE90',
            paper: 'rgba(0, 0, 0, 0.8)',
        },
        text: {
            primary: '#FFFFFF',
            secondary: '#000000',
        },
    },
})

export default function Index() {
    const [availableSheets, setAvailableSheets] = useState<string[]>([]);
    const [selectedRankingTitle, setSelectedRankingTitle] = useState<string>("");
    const [showingRankingData, setShowingRankingData] = useState<RankingVM>();
    const [rankingDataCache, setRankingDataCache] = useState<{ [key: string]: RankingVM }>({});

    // コンポーネントマウント時に利用可能なシート名を取得
    useEffect(() => {
        (async () => {
            const [getSheetsError, sheets] = await to(getAllSheets());
            if (getSheetsError) {
                console.error("Failed to get sheets:", getSheetsError);
                return;
            }

            setAvailableSheets(sheets);
            if (sheets.length > 0) {
                setSelectedRankingTitle(sheets[0]);
            }
        })();
    }, []);

    const handleRankingTitleChange = (event: SelectChangeEvent<string>) => {
        const selectedTitle = event.target.value;
        setSelectedRankingTitle(selectedTitle);
    }

    const getDatetimeComponent = (dateString: string) => {
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

    }

    useEffect(() => {
        if (!selectedRankingTitle) return; // シートが選択されていない場合は何もしない

        if (rankingDataCache[selectedRankingTitle]) {
            setShowingRankingData(rankingDataCache[selectedRankingTitle]);
        } else {
            // fetch data from the API
            (async () => {

                const [getSheetDataError, sheetData] = await to(getRankingSheets(selectedRankingTitle));
                if (getSheetDataError) {
                    console.error(getSheetDataError);
                    return;
                }

                setRankingDataCache((prev) => {
                    return { ...prev, [selectedRankingTitle]: sheetData }
                });
                setShowingRankingData(sheetData);
            })();
        }
    }, [selectedRankingTitle, rankingDataCache])

    const [showRuleModal, setShowRuleModal] = useState(false);
    const handleShowRuleModal = () => {
        setShowRuleModal(true);
    };
    const handleCloseRuleModal = () => {
        setShowRuleModal(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <Stack
                justifyContent={"center"}
                alignItems={"center"}
                bgcolor={theme.palette.background.default}
                minHeight={"100vh"}
                p={2}
            >
                <Container
                    maxWidth="lg"
                    component={Paper}
                    elevation={4}
                    sx={{
                        textAlign: "center",
                    }}
                >
                    {/* ヘッダー */}
                    <Box sx={{ m: 2 }}>
                        <Box>
                            <img
                                src="./logo.png"
                                alt="DDR Score Challenge Logo"
                                className="max-w-full md:max-w-[80%]"
                                style={{
                                    maxHeight: '200px',
                                    height: 'auto',
                                    margin: '0 auto',
                                }}
                            />
                            <FormControl variant="standard" sx={{ minWidth: 120 }}>
                                <Select
                                    disableUnderline
                                    id="challenge-number"
                                    value={selectedRankingTitle}
                                    onChange={handleRankingTitleChange}
                                    sx={{
                                        '.MuiSvgIcon-root ': {
                                            fill: "#00DE90 !important",
                                        }
                                    }}
                                >
                                    {availableSheets.map((title: string, index: number) => (
                                        <MenuItem key={index} value={title}>
                                            <Typography
                                                variant="h5"
                                                color={theme.palette.primary.main}
                                                fontFamily={'Montserrat, sans-serif'}
                                                textTransform={"uppercase"}
                                                fontWeight={700}
                                                whiteSpace={"wrap"}
                                            >
                                                {title}
                                            </Typography>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        {showingRankingData && (
                            <Typography variant="h5" color={"white"} my={2} >
                                {getDatetimeComponent(showingRankingData.startDate)}
                            </Typography>
                        )}
                    </Box>
                    <Stack>
                        <Box
                            display="flex"
                            justifyContent="center"
                        >
                            <Typography
                                variant="h5"
                                component="div"
                                color={theme.palette.primary.main}
                                onClick={handleShowRuleModal}
                                style={{
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                }}
                            >
                                ＜共通ルール＞
                            </Typography>
                        </Box>
                        <Dialog
                            open={showRuleModal}
                            onClose={handleCloseRuleModal}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogContent>
                                <img src={"./rule.png"} alt={"rule"} />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseRuleModal}>CLOSE</Button>
                            </DialogActions>
                        </Dialog>
                    </Stack>

                    {showingRankingData && (
                        <>
                            {/* 課題曲 */}
                            <Card sx={{
                                my: 2,
                                backgroundColor: "#00DE90",
                            }}>
                                <CardContent style={{
                                    padding: 4,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}>
                                    <Typography
                                        variant="h6"
                                        component="div"
                                        color={"#000000"}
                                        width={"100%"}
                                        borderBottom={1}
                                        borderColor={theme.palette.background.paper}
                                        pb={0}
                                    >
                                        課題曲
                                    </Typography>
                                    <List sx={{
                                        p: 0,
                                    }}>
                                        {showingRankingData.songs.map((song, index) => (
                                            <ListItem disablePadding dense key={index}>
                                                <ListItemText primary={
                                                    <Box
                                                        sx={{
                                                            md: {
                                                                fontSize: '2rem',
                                                                lineHeight: '2rem',
                                                            },
                                                            fontSize: '1.7rem',
                                                            lineHeight: '1.7rem',
                                                            color: "#000000",
                                                            fontFamily: '"Special Gothic Condensed One", sans-serif',
                                                        }}
                                                    >
                                                        {`${song.title} (${song.difficulty})`}
                                                    </Box>
                                                } />
                                            </ListItem>
                                        ))}
                                    </List>

                                </CardContent>
                            </Card>
                            <Ranking header={showingRankingData.header} dataRow={showingRankingData.rankingList} />
                        </>
                    )}

                    {/* フッター */}
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
                </Container>
            </Stack>
        </ThemeProvider>
    );
}
