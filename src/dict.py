import json
f = open("data/gps.csv", "r")
# csv_f = csv.reader(f)

gps_data = {}
for i in range (0,108):
    gps_data[i] = []

for rows in f.readlines()[1:]:
  rows = rows[:-1]
  row = rows.split(',')
#   print(row)
  id = int(row[1])
  gps_data[id].append({"time":row[0],"lat":row[2],"long":row[3], "id": row[1]})



with open('data/gps_clean.json', 'w') as outfile:
    json.dump(gps_data, outfile)