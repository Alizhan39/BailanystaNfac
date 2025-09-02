from __future__ import annotations
from pydantic import BaseModel, Field
from datetime import datetime


class UserOut(BaseModel):
    id: int
    username: str
    created_at: datetime


class PostIn(BaseModel):
    text: str = Field(min_length=1, max_length=1000)


class PostOut(BaseModel):
    id: int
    text: str
    created_at: datetime
    author: UserOut
