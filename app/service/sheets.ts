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
    avarageRow: {
        [key: string]: {
            max: string;
            value: string;
        }
    }
    medianRow: {
        [key: string]: {
            max: string;
            value: string;
        }
    }
    lastUpdated: string // 最終更新日
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

    const lastUpdated = jsonValues[10][7];

    const headerRowIndex = jsonValues.findIndex((v: string[]) => {
        return v.includes("順位")
    });
    const header = jsonValues[headerRowIndex].slice(1);
    const rankingList: string[][] = []
    for (let i = headerRowIndex + 1; (jsonValues[i]?.length ?? 0) != 0; i++) {
        rankingList.push(jsonValues[i].slice(1));
    }

    const avarageRowIndex = jsonValues.findIndex((v: string[]) => {
        // 平均値の行を探す("平均値"が含まれる行、正規表現を使用)
        return v.some(cell => /平均値/.test(cell));
    });

    const avarageRow: {
        [key: string]: {
            max: string;
            value: string;
        }
    } = avarageRowIndex === -1 ? {} : {
        [jsonValues[avarageRowIndex][2]]: {
            max: jsonValues[avarageRowIndex + 1][2],
            value: jsonValues[avarageRowIndex + 1][3],
        }
    };
    if (avarageRowIndex != -1) {
        for (let i = 4; i < header.length; i = i + 2) {
            if (!jsonValues[avarageRowIndex][i]) {
                break; // ヘッダーが空の場合は終了
            }
            avarageRow[jsonValues[avarageRowIndex][i]] = {
                max: jsonValues[avarageRowIndex + 1][i],
                value: jsonValues[avarageRowIndex + 1][i + 1],
            }
        }
    }

    const medianRowIndex = jsonValues.findIndex((v: string[]) => {
        // 中央値の行を探す("中央値"が含まれる行、正規表現を使用)
        return v.some(cell => /中央値/.test(cell));

    });
    const medianRow: {
        [key: string]: {
            max: string;
            value: string;
        }
    } = medianRowIndex === -1 ? {} : {
        [jsonValues[medianRowIndex][2]]: {
            max: jsonValues[medianRowIndex + 1][2],
            value: jsonValues[medianRowIndex + 1][3],
        }
    };
    if (medianRowIndex != -1) {
        for (let i = 4; i < header.length; i = i + 2) {
            if (!jsonValues[medianRowIndex][i]) {
                break; // ヘッダーが空の場合は終了
            }
            medianRow[jsonValues[medianRowIndex][i]] = {
                max: jsonValues[medianRowIndex + 1][i],
                value: jsonValues[medianRowIndex + 1][i + 1],
            }
        }
    }


    return {
        title,
        startDate,
        songs,
        header,
        rankingList,
        avarageRow,
        medianRow,
        lastUpdated: lastUpdated || '', // lastUpdatedが存在しない場合は空文字列を設定
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