# AI 프로젝트 개발 표준 가이드 (Chandra OCR 전용)

## 1. 기본 원칙
- **모델 명칭:** `datalab-to/chandra-ocr-2` (Hugging Face 오픈소스 모델).
- **언어 및 톤:** 모든 주석과 문서는 **한국어**를 사용하며, 전문적인 교육자 톤 유지.
- **환경:** Python 3.12.10, PyTorch, Transformers 라이브러리 필수.

## 2. 모델 로딩 및 리소스 관리
- **Singleton 패턴:** 모델은 서버 시작 시 전역 객체로 **단 1회만 로드**함. (요청마다 로드 금지)
- **장치 할당:** `torch.cuda.is_available()`을 체크하여 GPU(CUDA) 우선 할당.
- **메모리 최적화:** `torch.float16` (반정밀도)을 사용하여 VRAM 점유율을 최소화함.
- **Stateless 구조:** 분석 결과 데이터는 추출 즉시 MySQL에 저장하며, 로컬 메모리에는 남기지 않음.

## 3. 프로젝트 구조 (Chandra 모듈 전용)
/ai_project/chandra/chandra_module
                ├── model_loader.py (모델 선언 및 초기화 로직)
                ├── ocr_service.py (이미지 분석 및 텍스트 추출 함수)
                ├── utils.py (이미지 전처리 및 결과 정제)
                ├── database.py (MySQL 연동및쿼리관리)
                ├── dataset/ (이미지및학습데이터저장소)
                ├── CLAUDE2.md (현재가이드파일)
                └── requirements.txt (Transformers, Torch, Pillow 등)

## 4. 코딩스타일(Strict)
-**명명규칙:** 변수명과함수명은`camelCase` 사용.
-**반복문:** 리스트컴프리헨션사용금지. 반드시`for i in range(0, len(obj)):` 형식을취할것.
-**조건문:** `if-elif-else`를명확히구분하여작성.
-**함수:** 모든함수는`def funcName(param):` 뒤에`""" 함수설명"""`을필수로작성.
-**파일경로:** `os.path` 대신`os.listdir`와경로조작함수를적절히혼용하여관리.

## 5. 보안및에러처리
-**CORS:** 모든Origin/Method/Header 허용(`*`).
-**예외처리:** 전체로직을`try-except`로감싸고, 에러발생시아래JSON 반환.
-형식: `{"success": false, "message": "에러내용"}`