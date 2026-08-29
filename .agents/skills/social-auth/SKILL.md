---
name: social-auth
description: Guide and codebase instructions for integrating Kakao and Google social authentication (login and signup) in the CUSWAY project.
---

# Social Authentication Integration Guide

This skill provides step-by-step instructions for AI agents to implement fully working Kakao and Google OAuth2 social registration and login in the CUSWAY project.

## 1. External Credentials Required
* Kakao REST API Key
* Google OAuth Client ID & Secret
* Callback / Redirect URI: `http://localhost:5173/oauth/callback/kakao` & `http://localhost:5173/oauth/callback/google`

## 2. Frontend Actions (React)
- Replace mock trigger buttons in [App.tsx](file:///c:/Users/PJH/onestop-ai-custom-service/src/App.tsx) with actual redirect paths.
- Setup OAuth Callback Component or Route in the app to capture `?code=XXXX` parameter.
- Send POST requests containing the authorization code to the backend endpoints `/api/auth/social/kakao` and `/api/auth/social/google`.

## 3. Backend Actions (FastAPI)
- Implement POST endpoints `/api/auth/social/kakao` and `/api/auth/social/google` in [main.py](file:///c:/Users/PJH/onestop-ai-custom-service/backend/main.py).
- Exchange `code` for an access token via request to:
  - Kakao: `https://kauth.kakao.com/oauth/token`
  - Google: `https://oauth2.googleapis.com/token`
- Fetch user info:
  - Kakao: `https://kapi.kakao.com/v2/user/me`
  - Google: `https://www.googleapis.com/oauth2/v2/userinfo`
- Query the database `User` table:
  - If user exists, log in (return user profile).
  - If user does not exist, insert user profile (return new user profile with default basic plan and 1000 accrued points).

## 4. Run/Verify Commands
- Verify database state: `python check_db.py`
- Run local server: `npm.cmd run dev` (Vite) and `python -m uvicorn backend.main:app --host 127.0.0.1 --port 8090` (FastAPI)
