# -*- coding: utf-8 -*-
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from api.index import app
from fastapi.testclient import TestClient

client = TestClient(app)
resp = client.post('/api/cashback/appraise', json={
    'doc_type': 'hs',
    'item_name': '이차전지 실리콘 음극재',
    'identifier': '3824.99',
    'is_confidential': True,
    'decision_type': 'overturned'
})

data = resp.json()
print("Appraised Points:", data['appraised_points'])
print("Scarcity Grade:", data['scarcity_grade'])
print("Matched Public Count:", data['matched_public_count'])
print("Total points breakdown:", data['base_points'], "+", data['confidential_bonus'], "+", data['decision_bonus'], "+", data['scarcity_bonus'])
