# -*- coding: utf-8 -*-
import zipfile
import os

base_dir = r'D:\CC-Switch-v3.10.2-Windows-Portable\cherry-blossom-memories'
os.chdir(base_dir)

with zipfile.ZipFile('deploy.zip', 'w', zipfile.ZIP_DEFLATED) as zipf:
    zipf.write('frontend/dist/index.html', 'index.html')
    zipf.write('frontend/dist/assets/index-BuVgxeW8.css', 'assets/index-BuVgxeW8.css')
    zipf.write('frontend/dist/assets/index-Rr_AaBd8.js', 'assets/index-Rr_AaBd8.js')
    
    print('Files:')
    for name in zipf.namelist():
        print('  ' + name)

print('Created: deploy.zip')
