
import urllib.request
import json
try:
    with urllib.request.urlopen("http://127.0.0.1:8000/health") as response:
        content = response.read().decode('utf-8')
        print(f"Status: {response.getcode()}")
        print(f"Content: {content}")
except Exception as e:
    print(f"Error: {e}")
