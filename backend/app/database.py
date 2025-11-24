from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from app.config import settings

# Создание async engine
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=True,  # Логирование SQL запросов (отключи в production)
    future=True,
    pool_pre_ping=True,  # Проверка соединения перед использованием
)

# Session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

# Base класс для моделей
Base = declarative_base()


# Dependency для получения DB сессии
async def get_db() -> AsyncSession:
    """Dependency для инъекции DB сессии в endpoints"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


# Создание таблиц
async def init_db():
    """Создает все таблицы в БД"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
