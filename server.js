import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 8080;

// 1. 경로 설정: dist(빌드 결과물)와 public(원본 정적 파일) 두 곳을 모두 지정합니다.
const distPath = path.join(__dirname, 'dist');
const publicPath = path.join(__dirname, 'public');

// 2. 정적 파일 서빙 설정 (순서 중요!)
// 첫 번째: 빌드된 파일들이 있는 'dist' 폴더를 먼저 찾아봅니다.
app.use(express.static(distPath));

// 두 번째: 만약 dist에 파일이 없다면 'public' 폴더를 찾아봅니다. (여기에 logo.png가 있을 것입니다)
// 이 코드가 추가되어야 404 문제를 해결할 수 있습니다.
app.use(express.static(publicPath));

// 3. 정적 리소스(이미지, CSS 등)가 없을 때의 예외 처리
// 위 두 폴더(dist, public)에서도 파일을 못 찾았다면, index.html을 보내지 않고 진짜 404 에러를 냅니다.
// (브라우저가 이미지를 요청했는데 HTML을 받는 엉뚱한 상황 방지)
app.get(/\.(js|css|map|ico|png|jpg|jpeg|json|woff2?)$/, (req, res) => {
  console.log(`Resource not found: ${req.url}`); // 디버깅을 위해 로그 추가
  res.status(404).send('Resource not found');
});

// 4. SPA(Single Page App) 라우팅 처리
// 위의 모든 검사를 통과하지 못한 요청(페이지 이동 등)은 index.html을 돌려줍니다.
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  
  fs.readFile(indexPath, 'utf8', (err, htmlData) => {
    if (err) {
      console.error('Error reading index.html', err);
      return res.status(500).send('Server Error: Build output missing. Please check logs.');
    }

    // 환경 변수(API Key 등) 주입 로직 유지
    const apiKey = process.env.API_KEY || '';
    const envScript = `<script>window.env = { API_KEY: "${apiKey}" };</script>`;
    
    const finalHtml = htmlData.replace('</head>', `${envScript}</head>`);
    
    res.send(finalHtml);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Serving dist files from: ${distPath}`);
  console.log(`Serving public files from: ${publicPath}`);
});