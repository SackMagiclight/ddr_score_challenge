import type {MetaFunction} from "@remix-run/node";
import {useEffect, useState} from "react";
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
    SelectChangeEvent,
    ThemeProvider,
    Typography
} from "@mui/material";
import YouTubeIcon from '@mui/icons-material/YouTube';
import {Ranking} from "~/component/Ranking";

const API_KEY = import.meta.env.VITE_API_KEY;
const sid = `1lZSSNf4Zd0N2MdEPdB_CwnZLI7pr0gv9ZALxOneveag`;

export const meta: MetaFunction = () => {
    return [
        {title: "DDR Score Challenge"},
        {name: "description", content: "DDR Score Challenge"},
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
    typography: {
        fontFamily: 'Roboto, sans-serif',
        h1: {
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 700,
            fontSize: '2.5rem',
            textTransform: 'uppercase',
            letterSpacing: '2px',
        },
        body1: {
            fontSize: '1.2rem',
        },
    },
    components: {
        MuiTableCell: {
            styleOverrides: {
                head: {
                    backgroundColor: '#00DE90',
                    color: '#000000',
                    fontFamily: 'Montserrat, sans-serif',
                    textTransform: 'uppercase',
                },
                body: {
                    color: '#FFFFFF',
                    fontSize: '1.1rem',
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

export default function Index() {
    const targetSheets = [
        '4th (終了)',
        '3rd (終了)',
        '2nd (終了)',
        '1st (終了)',
    ]
    const [showPageDataTitle, setShowPageDataTitle] = useState(targetSheets[0]);
    const [showPageData, setShowPageData] = useState<
        {
            title: string
            startDate: string
            songs: {
                title: string
                mode: string
                difficulty: string
            }[]
            header: string[]
            dataRow: string[][]
        }>();

    const [pageDataCache, setPageDataCache] = useState<{
        [key: string]: {
            title: string
            startDate: string
            songs: {
                title: string
                mode: string
                difficulty: string
            }[]
            header: string[]
            dataRow: string[][]
        }
    }>({});
    const handleChange = (event: SelectChangeEvent<string>) => {
        const selectedTitle = event.target.value;
        setShowPageDataTitle(selectedTitle);
    }

    useEffect(() => {
        if (pageDataCache[showPageDataTitle]) {
            setShowPageData(pageDataCache[showPageDataTitle]);
        } else {
            // fetch data from the API
            (async () => {
                const sheetName = encodeURIComponent(`'${showPageDataTitle}'`);
                const sheetData = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sid}/values/${sheetName}?key=${API_KEY}`);
                const jsonData = await sheetData.json();
                const title = jsonData.values[1][1] as string;
                const startDate = jsonData.values[2][1] as string;
                let songs: {
                    title: string;
                    mode: string;
                    difficulty: string;
                }[] = [];
                for (let i = 5; jsonData.values[i].length != 0; i++) {
                    const mddf = jsonData.values[i][4].split('/');
                    songs.push({
                        title: jsonData.values[i][1],
                        mode: mddf[0].trim(),
                        difficulty: mddf[1].trim(),
                    });
                }

                const headerRow = jsonData.values.findIndex((v: string[]) => {
                    return v.includes("順位")
                });
                const header = jsonData.values[headerRow].slice(1) as string[];
                const dataRow: string[][] = []
                for (let i = headerRow + 1; (jsonData.values[i]?.length ?? 0) != 0; i++) {
                    dataRow.push(jsonData.values[i].slice(1));
                }

                const getVal = {
                    title,
                    startDate,
                    songs,
                    header,
                    dataRow,
                }

                setPageDataCache((prev) => {
                    const newVal = prev
                    newVal[showPageDataTitle] = getVal
                    return newVal
                });
                setShowPageData(getVal);
            })();
        }
    }, [showPageDataTitle])

    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    minHeight: '100vh',
                    background: theme.palette.background.default,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 2,
                }}
            >


                <Container
                    maxWidth="lg"
                    component={Paper}
                    sx={{
                        background: theme.palette.background.paper,
                        borderRadius: 2,
                        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.5)',
                        padding: 4,
                        textAlign: 'center',
                    }}
                >
                    {/* ヘッダー */}
                    <Box sx={{mb: 4}}>
                        <Box>
                            <Typography variant="h1" color="primary">
                                DDR Score Challenge
                            </Typography>
                            <FormControl variant="standard" sx={{m: 1, minWidth: 120}}>
                                <Select
                                    disableUnderline
                                    id="challenge-number"
                                    value={showPageDataTitle}
                                    onChange={handleChange}
                                    sx={{
                                        '.MuiSvgIcon-root ': {
                                            fill: "#00DE90 !important",
                                        }
                                    }}
                                >
                                    {targetSheets.map((title, index) => (
                                        <MenuItem key={index} value={title}>
                                            <Typography variant="h1" color="primary" whiteSpace={"wrap"}>{title}
                                            </Typography>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        {showPageData && (
                            <Typography variant="body1" sx={{mt: 1}}>
                                {showPageData.startDate}
                            </Typography>
                        )}
                    </Box>


                    <Box display={"flex"} justifyContent={"center"}>
                        <Typography variant="h5" color="primary" onClick={handleClickOpen}
                                    style={{
                                        cursor: 'pointer',
                                        textDecoration: 'underline',
                                    }}>
                            ＜共通ルール＞
                        </Typography>
                        <Dialog
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogContent>
                                <img src={"./rule.png"} alt={"rule"}/>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose}>CLOSE</Button>
                            </DialogActions>
                        </Dialog>
                    </Box>

                    {showPageData && (
                        <>
                            {/* 課題曲 */}
                            <Card variant="outlined" sx={{
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
                                    <Typography variant="h6" component="div" sx={{
                                        color: "#000000",
                                        pb: 0,
                                    }}>
                                        課題曲
                                    </Typography>
                                    <List sx={{
                                        p: 0,
                                    }}>
                                        {showPageData.songs.map((song, index) => (
                                            <ListItem disablePadding dense>
                                                <ListItemIcon>
                                                    <IconButton sx={{
                                                        py: 0,
                                                    }} disableRipple={true} size="large"
                                                                href={`https://www.youtube.com/results?search_query=${song.title}+${song.mode}+${song.difficulty}`}
                                                                target="_blank">
                                                        <YouTubeIcon style={{color: '#FF0032'}}/>
                                                    </IconButton>
                                                </ListItemIcon>
                                                <ListItemText primary={
                                                    <Box
                                                        sx={{
                                                            fontSize: '2rem',
                                                            lineHeight: '2rem',
                                                            color: "#000000",
                                                            fontFamily: '"Special Gothic Condensed One", sans-serif',
                                                        }}
                                                    >
                                                        {`${song.title} (${song.difficulty})`}
                                                    </Box>
                                                }/>
                                            </ListItem>
                                        ))}
                                    </List>

                                </CardContent>
                            </Card>


                            <Ranking header={showPageData.header} dataRow={showPageData.dataRow}/>
                        </>
                    )}

                    {/* フッター */}
                    <Box sx={{mt: 4}}>
                        <Typography variant="body2" sx={{opacity: 0.8}}>
                            主催：TAKA.S |{' '}
                            <Link
                                href="https://x.com/takas_kzn"
                                target="_blank"
                                color="primary"
                                sx={{textDecoration: 'none', '&:hover': {textDecoration: 'underline'}}}
                            >
                                Xで連絡
                            </Link>
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </ThemeProvider>
    );
}
