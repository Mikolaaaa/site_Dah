from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
import hashlib
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

security = HTTPBearer()


def hash_password(password: str) -> str:
    """Хеширование SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Проверка пароля"""
    computed_hash = hash_password(plain_password)
    # ⚠️ DEBUG: посмотрим, что приходит
    print(f"DEBUG: plain_password='{plain_password}'")
    print(f"DEBUG: computed_hash='{computed_hash}'")
    print(f"DEBUG: expected_hash='{hashed_password}'")
    print(f"DEBUG: match={computed_hash == hashed_password}")
    return computed_hash == hashed_password


# База пользователей
USERS = {
    "dahovskiy_admin": {
        "username": "dahovskiy_admin",
        "password": "e943869e269b8bcca3e21cae144be68dfef21600fffa8736233756b4684b646d",  # Dah!Bereg#2025$Adygea
        "full_name": "Administrator"
    }
}


def get_user(username: str):
    """Получить пользователя"""
    return USERS.get(username)


def authenticate_user(username: str, password: str):
    """Аутентификация"""
    user = get_user(username)
    if not user:
        print(f"DEBUG: User '{username}' not found")
        return False
    if not verify_password(password, user["password"]):
        print(f"DEBUG: Password mismatch for '{username}'")
        return False
    return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Создание JWT"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Проверка JWT"""
    token = credentials.credentials

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials",
            )
        return username
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
