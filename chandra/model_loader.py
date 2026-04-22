# pip install torch transformers
import torch
from transformers import AutoModel, AutoTokenizer
import os
from dotenv import load_dotenv

load_dotenv()

class ChandraModelManager:
    """ Chandra OCR 모델을 관리하는 Singleton 클래스입니다. """
    _instance = None
    _model = None
    _tokenizer = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ChandraModelManager, cls).__new__(cls)
        return cls._instance

    def loadModel(self):
        """ 모델을 단 1회 로드하여 메모리에 유지합니다. """
        if self._model is None:
            modelName = "datalab-to/chandra-ocr-2"
            useModel = os.getenv("USE_MODEL")
            
            if useModel == "CHANDRA":
                device = "cuda" if torch.cuda.is_available() else "cpu"
                # 반정밀도(float16) 적용 및 모델 로드
                self._tokenizer = AutoTokenizer.from_pretrained(modelName, trust_remote_code=True)
                self._model = AutoModel.from_pretrained(
                    modelName, 
                    torch_dtype=torch.float16 if device == "cuda" else torch.float32,
                    trust_remote_code=True
                )
                self._model.to(device)
                self._model.eval()
        
        return self._model, self._tokenizer

def getChandraModel():
    """ 전역적으로 모델 인스턴스를 가져오는 함수입니다. """
    manager = ChandraModelManager()
    return manager.loadModel()
