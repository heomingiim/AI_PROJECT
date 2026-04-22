const express = require('express');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const FormData = require('form-data');

const app = express();
const PORT = 3000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // public 폴더의 정적 파일 서비스

// multer 설정: 메모리에 파일 임시 저장
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * 이미지 분석 요청 API (Proxy)
 * 클라이언트로부터 받은 이미지와 질문을 FastAPI 서버(8000번 포트)로 전달
 */
app.post('/analyze', upload.single('image'), async (req, res) => {
    try {
        const { question } = req.body;
        const imageFile = req.file;

        if (!imageFile) {
            return res.status(400).json({ error: '이미지를 업로드해주세요.' });
        }

        // FastAPI 서버로 보낼 FormData 구성
        const formData = new FormData();
        formData.append('image', imageFile.buffer, {
            filename: imageFile.originalname,
            contentType: imageFile.mimetype,
        });
        formData.append('question', question || '');

        // FastAPI 서버(http://127.0.0.1:8000/analyze)로 데이터 전송
        console.log('FastAPI 서버로 요청 전송 중...');
        const response = await axios.post('http://127.0.0.1:8000/analyze', formData, {
            headers: {
                ...formData.getHeaders(),
            },
            timeout: 60000, // 60초 타임아웃 설정
        });

        console.log('FastAPI 서버로부터 응답 수신 성공');
        // FastAPI로부터 받은 결과를 클라이언트에 그대로 전달
        res.json(response.data);
    } catch (error) {
        let errorDetail = '';
        if (error.response) {
            // 서버가 응답을 반환했지만 2xx 범위를 벗어남
            errorDetail = JSON.stringify(error.response.data);
            console.error('FastAPI 서버 오류 응답:', error.response.status, errorDetail);
        } else if (error.request) {
            // 요청이 전송되었지만 응답을 받지 못함
            errorDetail = 'FastAPI 서버로부터 응답이 없습니다. 서버가 실행 중인지 확인하세요.';
            console.error('FastAPI 서버 응답 없음:', error.message);
        } else {
            // 요청 설정 중에 문제가 발생함
            errorDetail = error.message;
            console.error('요청 설정 오류:', error.message);
        }
        
        res.status(500).json({ 
            error: '서버 분석 중 오류가 발생했습니다.',
            details: errorDetail 
        });
    }
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`서버가 구동되었습니다: http://localhost:${PORT}`);
});
