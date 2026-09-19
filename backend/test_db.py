from app.database.connection import engine

try:
    connection = engine.connect()
    print("Banco conectado com sucesso!")
    connection.close()

except Exception as e:
    print("Erro ao conectar:")
    print(e)