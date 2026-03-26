
import urllib.request
import json
try:
    req = urllib.request.Request("http://127.0.0.1:8000/api/v1/users")
    with urllib.request.urlopen(req) as response:
        print(f"Status: {response.getcode()}")
except urllib.error.HTTPError as e:
    print(f"Status: {e.code}")
    print(f"Content: {e.read().decode()}")
except Exception as e:
    print(f"Error: {e}")
