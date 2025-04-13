import type { MetaFunction } from "@remix-run/node";
import {useMemo} from "react";
import {
  Box,
  Container,
  createTheme, Fade, IconButton, Link,
  Paper,
  Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow,
  ThemeProvider,
  Typography
} from "@mui/material";
import {ClientLoaderFunctionArgs, useLoaderData} from "@remix-run/react";
import YouTubeIcon from '@mui/icons-material/YouTube';

const API_KEY = import.meta.env.VITE_API_KEY;

export const meta: MetaFunction = () => {
  return [
    { title: "DDR Score Challenge" },
    { name: "description", content: "DDR Score Challenge" },
  ];
};

// カスタムテーマの作成
const theme = createTheme({
  palette: {
    primary: {
      main: '#00DE90', // 投稿画像のシアン系カラー
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

export const clientLoader = async ({}: ClientLoaderFunctionArgs) => {
  const sid = `1lZSSNf4Zd0N2MdEPdB_CwnZLI7pr0gv9ZALxOneveag`;
  const sheetName =  encodeURIComponent(`'4th (終了)'`);
  const sheetData = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sid}/values/${sheetName}?key=${API_KEY}`);
  const jsonData = await sheetData.json();
  return {
    jsonData,
  };
};

export default function Index() {
  const data = useLoaderData<typeof clientLoader>();
  const pageData = useMemo(() => {
    const title = data.jsonData.values[1][1] as string;
    const startDate = data.jsonData.values[2][1] as string;
    let songs: {
      title: string;
      mode: string;
      difficulty: string;
    }[] = [];
    for (let i = 5; data.jsonData.values[i].length != 0; i++) {
      const mddf = data.jsonData.values[i][4].split('/');
      songs.push({
        title: data.jsonData.values[i][1],
        mode: mddf[0].trim(),
        difficulty: mddf[1].trim(),
      });
    }

    const headerRow = data.jsonData.values.findIndex((v: string[]) => { return v.includes("順位") });
    const header = data.jsonData.values[headerRow].slice(1) as string[];
    const dataRow: string[][] = []
    for (let i = headerRow + 1; data.jsonData.values[i].length != 0; i++) {
      dataRow.push(data.jsonData.values[i].slice(1));
    }

    return {
        title,
        startDate,
        songs,
        header,
        dataRow,
    }
  }, [data]);

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
            <Box sx={{ mb: 4 }}>
              <Typography variant="h1" color="primary">
                {pageData.title}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {pageData.startDate}
              </Typography>
            </Box>

            {/* 課題曲 */}
            <Box display={`flex`} flexDirection={`column`} gap={1} my={2}>
              {pageData.songs.map((song, index) => (
                    <Box
                        key={index}
                        display={`flex`}
                        justifyContent={`center`}
                        alignItems={`center`}
                        flexGrow={1}
                        sx={{
                          backgroundColor: theme.palette.primary.main,
                          color: theme.palette.text.secondary,
                          fontFamily: 'Montserrat, sans-serif',
                          fontSize: '1.1rem',
                          textTransform: 'uppercase',
                          padding: '10px 20px',
                          borderRadius: '10px',
                          transition: 'transform 0.3s ease',
                    }}

                    >
                      <Box>{`${song.title} (${song.difficulty})`}</Box>
                      <IconButton disableRipple={true} size="large" href={`https://www.youtube.com/results?search_query=${song.title}+${song.mode}+${song.difficulty}`} target="_blank">
                        <YouTubeIcon style={{ color: '#FF0032' }} />
                      </IconButton>
                    </Box>
              ))}
            </Box>

            {/* ランキングテーブル */}
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="ranking table">
                <TableHead>
                  <TableRow>
                    {pageData.header.map((header, index) => (
                        <TableCell key={index}>{header}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pageData.dataRow.map((row, index) => (
                      <Fade in timeout={300 * (index + 1)} key={index}>
                      <TableRow>
                        <>{row.map((c, index2) => (
                          <TableCell key={index2}>{c}</TableCell>
                        ))}</>
                      </TableRow>
                      </Fade>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* フッター */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                主催：TAKA.S |{' '}
                <Link
                    href="https://x.com/takas_kzn"
                    target="_blank"
                    color="primary"
                    sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
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
