import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Typography
} from "@mui/material";
import { theme as appTheme } from "~/styles/theme";

type RuleModalProps = {
    open: boolean;
    onClose: () => void;
    onOpen: () => void;
};

export const RuleModal = ({ open, onClose, onOpen }: RuleModalProps) => {
    return (
        <>
            <Box
                display="flex"
                justifyContent="center"
            >
                <Typography
                    variant="h5"
                    component="div"
                    color={appTheme.palette.primary.main}
                    onClick={onOpen}
                    style={{
                        cursor: 'pointer',
                        textDecoration: 'underline',
                    }}
                >
                    ＜共通ルール＞
                </Typography>
            </Box>
            <Dialog
                open={open}
                onClose={onClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <img src={"./rule.jpg"} alt={"rule"} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>CLOSE</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
