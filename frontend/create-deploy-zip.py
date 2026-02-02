import zipfile
import os

dist_path = r'D:\CC-Switch-v3.10.2-Windows-Portable\cherry-blossom-memories\frontend\dist'
output_path = r'D:\CC-Switch-v3.10.2-Windows-Portable\cherry-blossom-memories\frontend\edgeone-deploy.zip'

with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(dist_path):
        for file in files:
            file_path = os.path.join(root, file)
            arcname = file_path.replace(dist_path + os.sep, '').replace('\', '/')
            zipf.write(file_path, arcname)
            print(f'Added: {arcname}')

print(f'\nCreated: {output_path}')
