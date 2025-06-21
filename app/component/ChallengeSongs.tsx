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
                }}>
                    {songs.map((song, index) => (
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
    );
};
