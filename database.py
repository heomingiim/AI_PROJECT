import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

def getDbConnection():
    """ 
    MySQL 데이터베이스 연결을 생성하고 반환하는 함수입니다.
    """
    try:
        connection = mysql.connector.connect(
            host=os.getenv("MYSQL_HOST"),
            user=os.getenv("MYSQL_USER"),
            password=os.getenv("MYSQL_PASSWORD"),
            database=os.getenv("MYSQL_DATABASE")
        )
        return connection
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

def saveData(tableName, data):
    """ 
    데이터베이스에 정보를 저장하는 함수입니다.
    """
    try:
        connection = getDbConnection()
        if connection is not None:
            cursor = connection.cursor()
            # 예시 쿼리 (실제 테이블 구조에 맞게 수정 필요)
            # cursor.execute(f"INSERT INTO {tableName} ...")
            connection.commit()
            cursor.close()
            connection.close()
            return True
        return False
    except Exception as e:
        print(f"Error saving data: {e}")
        return False
