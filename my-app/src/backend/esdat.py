from lxml import etree
import os
from datetime import datetime
from find_sdat import filtered
import json

esdat = r"./uploads/Sdat"
esdatdir = filtered


res = {"data": [
      {
        "ts": "1503495302",
        "value": 82.03
      }
    ]}

def get_esdat(timePeriods): 
    timeIntervals = {"ID742": {"data": []}, "ID735": {"data": []}}
    sum1 = 0
    sum2 = 0
    target1 = timePeriods[0][1]
    target2 = timePeriods[0][2]


    for i in esdatdir:
        document = etree.parse(os.path.join(esdat, i))
        id = document.xpath("//rsm:InstanceDocument", namespaces={'rsm': 'http://www.strom.ch'})[0]
        id = id.getchildren()[2].text
        intervals = document.xpath("//rsm:Interval", namespaces={'rsm': 'http://www.strom.ch'})
        start = intervals[0].xpath(".//rsm:StartDateTime", namespaces={'rsm': 'http://www.strom.ch'})[0].text

        start_date = datetime.strptime(start[:10], "%Y-%m-%d")
        time_period_date = datetime.strptime(timePeriods[0][0][:10], "%Y-%m-%d")

        if not timePeriods:
            break

        if start_date.year != time_period_date.year or start_date.month != time_period_date.month:
            sum1 = 0
            sum2 = 0
            
            timePeriods.pop(0)
            
            if not timePeriods:
                break
            
            target1 = timePeriods[0][1]
            target2 = timePeriods[0][2]

        if "ID742" in id and "ID735" not in id:
            try:
                volumes = map(lambda x: x.text, document.xpath("//rsm:Volume", namespaces={'rsm': 'http://www.strom.ch'}))
                sums = sum([float(y) for y in volumes])
                if not sum1:
                    timeIntervals["ID742"]["data"].append({"ts":timePeriods[0][0]+"Z", "value":target1, "usage":sums})
                    sum1 = target1
                    sum1 += sums
                    timeIntervals["ID742"]["data"].append({"ts":start, "value":sum1, "usage":sums})
                else:
                    sum1 += sums
                    timeIntervals["ID742"]["data"].append({"ts":start, "value":sum1, "usage":sums})
            except Exception as e:
                print(f"Error processing file: {e}")
                continue
        elif "ID735" in id and "ID742" not in id:
            try:
                volumes = map(lambda x: x.text, document.xpath("//rsm:Volume", namespaces={'rsm': 'http://www.strom.ch'}))
                sums = sum([float(y) for y in volumes])
                if not sum2:
                    timeIntervals["ID735"]["data"].append({"ts":timePeriods[0][0]+"Z", "value":target2, "usage":sums})
                    sum2 = target2
                    sum2 += sums
                    timeIntervals["ID735"]["data"].append({"ts":start, "value":sum2, "usage":sums})
                else:
                    sum2 += sums
                    timeIntervals["ID735"]["data"].append({"ts":start, "value":sum2, "usage":sums})
            except Exception as e:
                print(f"Error processing file: {e}")
                continue

    with open('output.json', 'w') as json_file:
        json.dump(timeIntervals, json_file, indent=4)    
    print("File created successfully!")




if __name__ == "__main__":
    get_esdat("hey")