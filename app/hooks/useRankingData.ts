import { useEffect, useState } from "react";
import to from "await-to-js";
import { getAllSheets, getRankingSheets, RankingVM } from "~/service/sheets";

export const useRankingData = () => {
    const [availableSheets, setAvailableSheets] = useState<string[]>([]);
    const [selectedRankingTitle, setSelectedRankingTitle] = useState<string>("");
    const [showingRankingData, setShowingRankingData] = useState<RankingVM>();
    const [rankingDataCache, setRankingDataCache] = useState<{ [key: string]: RankingVM }>({});
    const [isLoadingSheets, setIsLoadingSheets] = useState(true);
    const [isLoadingData, setIsLoadingData] = useState(false);

    // コンポーネントマウント時に利用可能なシート名を取得
    useEffect(() => {
        (async () => {
            setIsLoadingSheets(true);
            const [getSheetsError, sheets] = await to(getAllSheets());
            if (getSheetsError) {
                console.error("Failed to get sheets:", getSheetsError);
                setIsLoadingSheets(false);
                return;
            }

            setAvailableSheets(sheets);
            if (sheets.length > 0) {
                setSelectedRankingTitle(sheets[0]);
            }
            setIsLoadingSheets(false);
        })();
    }, []);

    // 選択されたランキングタイトルに基づいてデータを取得
    useEffect(() => {
        if (!selectedRankingTitle) return;

        if (rankingDataCache[selectedRankingTitle]) {
            setShowingRankingData(rankingDataCache[selectedRankingTitle]);
        } else {
            (async () => {
                setIsLoadingData(true);
                const [getSheetDataError, sheetData] = await to(getRankingSheets(selectedRankingTitle));
                if (getSheetDataError) {
                    console.error(getSheetDataError);
                    setIsLoadingData(false);
                    return;
                }

                setRankingDataCache((prev) => {
                    return { ...prev, [selectedRankingTitle]: sheetData }
                });
                setShowingRankingData(sheetData);
                setIsLoadingData(false);
            })();
        }
    }, [selectedRankingTitle, rankingDataCache]);

    return {
        availableSheets,
        selectedRankingTitle,
        setSelectedRankingTitle,
        showingRankingData,
        isLoadingSheets,
        isLoadingData,
    };
};
