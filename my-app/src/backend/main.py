from lxml import etree
import os
from datetime import datetime
from dateutil.relativedelta import relativedelta
from esdat import get_esdat

esl = r"./uploads/Esl"
esldir = sorted(os.listdir(esl))

timePeriods = []




def monthly(item):
    rows = item.getchildren()
    
    if len(rows) < 4:
        raise ValueError

    hoch_verbrauch = next((float(row.get("value", 0)) for row in rows if row.get("obis") == "1-1:1.8.1"), 0)
    nieder_verbrauch = next((float(row.get("value", 0)) for row in rows if row.get("obis") == "1-1:1.8.2"), 0)
    hoch_einkauf = next((float(row.get("value", 0)) for row in rows if row.get("obis") == "1-1:2.8.1"), 0)
    nieder_einkauf = next((float(row.get("value", 0)) for row in rows if row.get("obis") == "1-1:2.8.2"), 0)

    verbrauch = hoch_verbrauch + nieder_verbrauch
    einkauf = hoch_einkauf + nieder_einkauf
    
    date = str(item.attrib.get('end', 'unknown'))
    date = datetime.strptime(date, "%Y-%m-%dT%H:%M:%S")


    new_date_obj = date - relativedelta(months=1)
    new_date_str = new_date_obj.strftime("%Y-%m-%dT%H:%M:%S")
    
    return (new_date_str, verbrauch, einkauf) if verbrauch and einkauf else ()



for i in esldir:
    document = etree.parse(esl + "/" + i)
    
    try:
        timePeriods += (map(monthly, document.xpath("//TimePeriod")))
    except ValueError:
        continue
    
     
timePeriods = sorted(set([i for i in timePeriods if i]), key=lambda x: datetime.strptime(x[0], "%Y-%m-%dT%H:%M:%S"))[4:]
timePeriods = list(map(lambda x: (x[0], x[1], x[2]), timePeriods))
 
if __name__ == "__main__":
    get_esdat(timePeriods)

    

