import os
import json
import re
from collections import Counter

THIS_FOLDER = os.path.dirname(os.path.abspath(__file__))
relevantFilePath = os.path.join(THIS_FOLDER, 'raakattu_sanalista.json')
sanalista = open(relevantFilePath, encoding='utf8')
jsonSanat = json.load(sanalista)
relevantFilePath = os.path.join(THIS_FOLDER, 'sanalistaTuloste.json')
sanatTuloste = open(relevantFilePath, 'w', encoding='utf8')
#jsonData = []

for i in jsonSanat:
  print(i['s'])
  #jsonString = json.dumps({'word': i['s']})
  #jsonData.append({'word': i['s']})
  sanatTuloste.write('{"word": "' + i['s']  + '" } \n')

sanatTuloste.close()

#print(jsonString)
#print(jsonData)

#with open(relevantFilePath, "w") as outfile:
#  json.dump(jsonData, outfile, indent=2)
#outfile.close()
#jsonFile.write(jsonString)
#jsonFile.close()