# -*- coding: utf-8 -*-
import requests
import sys

BASE_URL = "http://127.0.0.1:8090"

def test_auth():
    print("Testing Auth Endpoints on Local Backend...")
    
    # 1. Test Social Config
    try:
        r = requests.get(f"{BASE_URL}/api/auth/social/config", timeout=5)
        print("1. Social Config:", r.status_code, r.json())
    except Exception as e:
        print("Backend server might not be running on 8090:", e)
        return

    # 2. Test Signup
    test_email = "test_user_2026@cusway.kr"
    signup_data = {
        "email": test_email,
        "password": "password1234!",
        "company_name": "주식회사 한양무역",
        "user_type": "general_user",
        "years_of_experience": 2
    }
    r = requests.post(f"{BASE_URL}/api/auth/signup", json=signup_data, timeout=5)
    print("2. Signup Status:", r.status_code)
    if r.status_code in [200, 400]: # 400 if already created
        print("   Signup response:", r.json())

    # 3. Test Login
    login_data = {
        "email": test_email,
        "password": "password1234!"
    }
    r = requests.post(f"{BASE_URL}/api/auth/login", json=login_data, timeout=5)
    print("3. Login Status:", r.status_code)
    if r.status_code == 200:
        print("   Login success! User:", r.json().get("email"), r.json().get("company_name"), "Weight:", r.json().get("credibility_weight"))
    else:
        print("   Login failed:", r.text)

if __name__ == "__main__":
    test_auth()
