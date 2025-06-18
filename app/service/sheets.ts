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

// シート情報を取得するための型
type SheetInfo = {
    title: string;
}

// 全シートの一覧を取得
export const getAllSheets = async (): Promise<string[]> => {
    const [getSpreadsheetError, spreadsheetData] = await to(fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?key=${API_KEY}`));
    if (getSpreadsheetError) {
        console.error(getSpreadsheetError);
        throw getSpreadsheetError;
    }

    const [getJsonDataError, jsonData] = await to(spreadsheetData.json());
    if (getJsonDataError) {
        console.error(getJsonDataError);
        throw getJsonDataError;
    }

    const sheets = jsonData.sheets as { properties: SheetInfo }[];
    return sheets.map(sheet => sheet.properties.title);
}

// 特定のシートからデータを取得（内部使用）
const getSheetData = async (sheetName: string): Promise<RankingVM> => {
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

// 全シートのデータを取得
export const getAllRankingSheets = async (): Promise<RankingVM[]> => {
    const [getSheetsError, sheetNames] = await to(getAllSheets());
    if (getSheetsError) {
        console.error('Failed to get sheet names:', getSheetsError);
        throw getSheetsError;
    }
    
    const results: RankingVM[] = [];
    
    for (const sheetName of sheetNames) {
        const [getSheetDataError, sheetData] = await to(getSheetData(sheetName));
        if (getSheetDataError) {
            console.error(`Error fetching data for sheet ${sheetName}:`, getSheetDataError);
            // エラーが発生したシートはスキップして続行
            continue;
        }
        results.push(sheetData);
    }
    
    return results;
}

// 後方互換性のために残す
export const getRankingSheets = async (sheetName: string): Promise<RankingVM> => {
    return getSheetData(sheetName);
}