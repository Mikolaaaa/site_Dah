from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Настройки приложения из .env"""
    
    # Основные
    PROJECT_NAME: str = "Гостиница Даховский берег"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Database
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "hotel_user"
    POSTGRES_PASSWORD: str = "hotel_pass"
    POSTGRES_DB: str = "hotel_db"
    POSTGRES_PORT: str = "5432"
    
    # Для SQLite в разработке (закомментируй для Postgres)
    # DATABASE_URL: str = "sqlite+aiosqlite:///./hotel.db"
    
    @property
    def DATABASE_URL(self) -> str:
        """Формирует DATABASE_URL для async PostgreSQL"""
        return (
            f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )
    
    # Upload
    UPLOAD_DIR: str = "uploads/photos"
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS: set = {".jpg", ".jpeg", ".png", ".webp"}
    
    # CORS
    BACKEND_CORS_ORIGINS: list = ["http://localhost:5173", "http://localhost:3000", "https://*.cloudpub.ru"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
