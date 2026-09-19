from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.configuracao_empresa import ConfiguracaoEmpresa
from app.schemas.configuracao_empresa import ConfiguracaoEmpresaSalvar

router = APIRouter(
    prefix="/configuracoes",
    tags=["Configurações"]
)

@router.get("/")
def obter_configuracoes(db: Session = Depends(get_db)):
    config = db.query(ConfiguracaoEmpresa).first()

    if not config:
        config = ConfiguracaoEmpresa()
        db.add(config)
        db.commit()
        db.refresh(config)

    return config


@router.put("/")
def salvar_configuracoes(
    dados: ConfiguracaoEmpresaSalvar,
    db: Session = Depends(get_db)
):
    config = db.query(ConfiguracaoEmpresa).first()

    if not config:
        config = ConfiguracaoEmpresa()
        db.add(config)

    config.nome_empresa = dados.nome_empresa
    config.nome_fantasia = dados.nome_fantasia
    config.cnpj = dados.cnpj
    config.telefone = dados.telefone
    config.whatsapp = dados.whatsapp
    config.email = dados.email
    config.endereco = dados.endereco
    config.mensagem_comprovante = dados.mensagem_comprovante

    db.commit()
    db.refresh(config)

    return {
        "mensagem": "Configurações salvas com sucesso",
        "configuracao": config
    }