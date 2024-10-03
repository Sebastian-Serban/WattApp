from lxml import etree
import os
from datetime import datetime

esdat = r"./uploads/Sdat"
esdatdir = sorted(os.listdir(esdat))

file_time_list = []

for i in esdatdir:
    file_path = os.path.join(esdat, i)
    try:
        document = etree.parse(file_path)
        
        start_time = document.xpath("//rsm:StartDateTime", namespaces={'rsm': 'http://www.strom.ch'})
        
        if start_time:
            start_time_str = start_time[0].text
            start_time_obj = datetime.strptime(start_time_str, "%Y-%m-%dT%H:%M:%SZ")
            
            if int(start_time_str[:4]) > 2018 and start_time_str[:7] not in ["2019-01","2019-02","2019-03"]:
                file_time_list.append((i, start_time_obj))
        else:
            print(f"No StartDateTime found in file: {i}")
    
    except Exception as e:
        print(f"Error processing file {i}: {e}")

file_time_list.sort(key=lambda x: x[1])

filtered = []
for filename, start_time in file_time_list:
    filtered.append(filename)
