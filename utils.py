def check_url_protocol(url):
    if url[:5] != 'https':
        return 'http'
    else:
        return 'https'