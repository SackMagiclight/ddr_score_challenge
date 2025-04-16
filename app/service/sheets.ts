import to from "await-to-js";

const API_KEY = import.meta.env.VITE_API_KEY;
const spreadsheetId = `1lZSSNf4Zd0N2MdEPdB_CwnZLI7pr0gv9ZALxOneveag`;

export type RankingVM = {
    title: string
    startDate: string
    songs: {
        title: string
        mode: string
        difficulty: string
    }[]
    header: string[]
    rankingList: string[][]
}

export const getRankingSheets = async (sheetName: string): Promise<RankingVM> => {
    const encodedSheetName = encodeURIComponent(`'${sheetName}'`);
    const [getSheetDataError, sheetData] = await to(fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodedSheetName}?key=${API_KEY}`));
    if (getSheetDataError) {
        console.error(getSheetDataError);
        throw getSheetDataError;
    }

    const [getJsonDataError, jsonData] = await to(sheetData.json());
    if (getJsonDataError) {
        console.error(getJsonDataError);
        throw getJsonDataError;
    }

    const jsonValues = jsonData.values as string[][];
    const title = jsonValues[1][1];
    const startDate = jsonValues[2][1];
    let songs: RankingVM["songs"] = [];
    for (let i = 5; jsonValues[i].length != 0; i++) {
        const songModeDiffString = jsonValues[i][4].split('/');
        songs.push({
            title: jsonValues[i][1],
            mode: songModeDiffString[0].trim(),
            difficulty: songModeDiffString[1].trim(),
        });
    }

    const headerRowIndex = jsonValues.findIndex((v: string[]) => {
        return v.includes("順位")
    });
    const header = jsonValues[headerRowIndex].slice(1);
    const rankingList: string[][] = []
    for (let i = headerRowIndex + 1; (jsonValues[i]?.length ?? 0) != 0; i++) {
        rankingList.push(jsonValues[i].slice(1));
    }

    return {
        title,
        startDate,
        songs,
        header,
        rankingList,
    }
}