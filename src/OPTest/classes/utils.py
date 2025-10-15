from urllib.parse import urlparse

def check_url_protocol(url):
    if url[:5] != 'https':
        return 'http'
    else:
        return 'https'
    
def log_response(res, not_log_if_code=200):
    log = f'    {res.request.method} {urlparse(res.url).path}{urlparse(res.url).params} - '
    if res.status_code != not_log_if_code:
        log += f'{res.json()}'
    else: 
        log += f'Status {res.status_code}'
    print(log)

def log_info(text):
    print(text)

def log_caller_file(file_name):
    print(' ')
    print('-------------------------------------')
    print(f'Starting test file: {file_name}')
    print('-------------------------------------')