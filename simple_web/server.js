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

        // FastAPI 서버(http://localhost:8000/analyze)로 데이터 전송
        const response = await axios.post('http://localhost:8000/analyze', formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });

        // FastAPI로부터 받은 결과를 클라이언트에 그대로 전달
        res.json(response.data);
    } catch (error) {
        const errorDetail = error.response ? JSON.stringify(error.response.data) : error.message;
        console.error('FastAPI 서버 연동 오류:', errorDetail);
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
