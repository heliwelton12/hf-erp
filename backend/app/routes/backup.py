from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from datetime import datetime
from zoneinfo import ZoneInfo
import os
import subprocess

router = APIRouter(
    prefix="/backup",
    tags=["Backup"]
)

DB_HOST = "localhost"
DB_PORT = "5432"
DB_USER = "postgres"
DB_NAME = "hf_erp"
DB_PASSWORD = os.getenv("DB_PASSWORD")

def agora_bahia():
    return datetime.now(ZoneInfo("America/Bahia"))

@router.get("/gerar")
def gerar_backup():
    try:
        os.makedirs("backups", exist_ok=True)

        nome_arquivo = f"backup_hferp_{agora_bahia().strftime('%Y%m%d_%H%M%S')}.sql"
        caminho_arquivo = os.path.join("backups", nome_arquivo)

        comando = [
    r"C:\Program Files\PostgreSQL\18\bin\pg_dump.exe",
    "-h", DB_HOST,
    "-p", DB_PORT,
    "-U", DB_USER,
    "-d", DB_NAME,
    "-f", caminho_arquivo
]

        ambiente = os.environ.copy()
        ambiente["PGPASSWORD"] = DB_PASSWORD

        resultado = subprocess.run(
            comando,
            env=ambiente,
            capture_output=True,
            text=True
        )

        if resultado.returncode != 0:
            raise HTTPException(
                status_code=500,
                detail=f"Erro ao gerar backup: {resultado.stderr}"
            )

        return FileResponse(
            caminho_arquivo,
            filename=nome_arquivo,
            media_type="application/sql"
        )

    except Exception as erro:
        raise HTTPException(
            status_code=500,
            detail=f"Erro inesperado ao gerar backup: {str(erro)}"
        )