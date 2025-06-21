import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";
import {
    Box,
    CircularProgress,
    Container,
    Paper,
    SelectChangeEvent,
    Stack,
    ThemeProvider,
    Typography
} from "@mui/material";
import { Ranking } from "~/component/Ranking";
import { Header } from "~/component/Header";
import { RuleModal } from "~/component/RuleModal";
import { ChallengeSongs } from "~/component/ChallengeSongs";
import { Footer } from "~/component/Footer";
import { useRankingData } from "~/hooks/useRankingData";
import { theme as appTheme } from "~/styles/theme";

export const meta: MetaFunction = () => {
    return [];
};

export default function Index() {
    const {
        availableSheets,
        selectedRankingTitle,
        setSelectedRankingTitle,
        showingRankingData,
        isLoadingSheets,
        isLoadingData,
    } = useRankingData();

    const [showRuleModal, setShowRuleModal] = useState(false);

    const handleRankingTitleChange = (event: SelectChangeEvent<string>) => {
        const selectedTitle = event.target.value;
        setSelectedRankingTitle(selectedTitle);
    }

    const handleShowRuleModal = () => {
        setShowRuleModal(true);
    };

    const handleCloseRuleModal = () => {
        setShowRuleModal(false);
    };

    return (
        <ThemeProvider theme={appTheme}>
            <Stack
                justifyContent={"center"}
                alignItems={"center"}
                bgcolor={appTheme.palette.background.default}
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
                    <Header
                        availableSheets={availableSheets}
                        selectedRankingTitle={selectedRankingTitle}
                        onRankingTitleChange={handleRankingTitleChange}
                        showingRankingData={showingRankingData}
                    />

                    <Stack>
                        <RuleModal
                            open={showRuleModal}
                            onClose={handleCloseRuleModal}
                            onOpen={handleShowRuleModal}
                        />
                    </Stack>

                    {(isLoadingSheets || isLoadingData) && (
                        <Box 
                            sx={{ 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center',
                                minHeight: '300px',
                                flexDirection: 'column',
                                gap: 2
                            }}
                        >
                            <CircularProgress 
                                size={60} 
                                sx={{ color: appTheme.palette.primary.main }} 
                            />
                        </Box>
                    )}

                    {!isLoadingSheets && !isLoadingData && showingRankingData && (
                        <>
                            <ChallengeSongs songs={showingRankingData.songs} />
                            <Ranking header={showingRankingData.header} dataRow={showingRankingData.rankingList} />
                            <Box
                                sx={{
                                    textAlign: 'right',
                                }}
                            >{showingRankingData.lastUpdated}</Box>
                        </>
                    )}

                    <Footer />
                </Container>
            </Stack>
        </ThemeProvider>
    );
}
