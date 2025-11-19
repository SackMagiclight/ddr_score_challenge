import {
    Box,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    Typography
} from "@mui/material";
import { theme as appTheme } from "~/styles/theme";
import { RankingVM } from "~/service/sheets";

type ChallengeSongsProps = {
    songs: RankingVM["songs"];
};

export const ChallengeSongs = ({ songs }: ChallengeSongsProps) => {
    return (
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
                    borderColor={appTheme.palette.background.paper}
                    pb={0}
                >
                    課題曲
                </Typography>
                <List sx={{
                    p: 0,
                    maxWidth: "100%",
                    overflowX: "auto",
                    overflowY: "hidden",
                }}>
                    {songs.map((song, index) => (
                        <ListItem disablePadding dense key={index}>
                            <ListItemText
                                sx={{
                                    marginTop: "2px",
                                    marginBottom: "2px",
                                }}
                                primary={
                                    <Box
                                        sx={{
                                            fontSize: {
                                                xs: '1.2rem',
                                                md: '1.6rem',
                                            },
                                            lineHeight: {
                                                xs: '1.2rem',
                                                md: '1.6rem',
                                            },
                                            whiteSpace: 'nowrap',
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
    );
};
