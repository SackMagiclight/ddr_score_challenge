import {
    Box,
    FormControl,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography
} from "@mui/material";
import { theme as appTheme } from "~/styles/theme";
import { formatDateRange } from "~/utils/dateUtils";
import { RankingVM } from "~/service/sheets";

type HeaderProps = {
    availableSheets: string[];
    selectedRankingTitle: string;
    onRankingTitleChange: (event: SelectChangeEvent<string>) => void;
    showingRankingData?: RankingVM;
};

export const Header = ({
    availableSheets,
    selectedRankingTitle,
    onRankingTitleChange,
    showingRankingData
}: HeaderProps) => {
    return (
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
                        onChange={onRankingTitleChange}
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
                                    color={appTheme.palette.primary.main}
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
                    {formatDateRange(showingRankingData.startDate)}
                </Typography>
            )}
        </Box>
    );
};
