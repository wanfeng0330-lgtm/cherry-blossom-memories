import zipfile
import os

os.chdir(r'D:\CC-Switch-v3.10.2-Windows-Portable\cherry-blossom-memories')

with zipfile.ZipFile('deploy.zip', 'w', zipfile.ZIP_DEFLATED) as zf:
    zf.write('frontend/dist/index.html', 'index.html')
    zf.write('frontend/dist/assets/index-BuVgxeW8.css', 'assets/index-BuVgxeW8.css')
    zf.write('frontend/dist/assets/index-Rr_AaBd8.js', 'assets/index-Rr_AaBd8.js')
    for name in zf.namelist():
        print('Added:', name)
print('Created: deploy.zip')
