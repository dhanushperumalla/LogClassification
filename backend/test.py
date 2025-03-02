import requests

url = "http://127.0.0.1:8000/classify/"
files = {'file': open(r"resources/test.csv", 'rb')}
response = requests.post(url, files=files)

print(response.status_code)
print(response.content)