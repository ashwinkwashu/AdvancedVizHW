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


new_gps_data = {}
for i in range (0,108):
    new_gps_data[i] = []



count_save =0
count_write = 1
total = 0

for i in range(108):
    previous = None
    prev2 = previous
    for row in gps_data[i]:
        total +=1
        if previous:
            if previous["id"] == row["id"]:
                if ((float(row["lat"]) - float(previous["lat"]))**2 + (float(row["long"]) - float(previous["long"]))**2)**0.5 <= 0.001:
                    prev2 = row
                    count_save+=1
                    continue
                else:
                    new_gps_data[int(previous["id"])].append({"time":previous["time"],"lat":previous["lat"],"long":previous["long"], "id": previous["id"], "time2": prev2["time"]})
                    count_write+=1
                    previous = row
                    prev2 = previous
                    continue
            else:
                new_gps_data[int(previous["id"])].append({"time":previous["time"],"lat":previous["lat"],"long":previous["long"], "id": previous["id"], "time2": prev2["time"]})
                count_write+=1
                previous = row
                prev2 = previous
        else:
            id = int(row["id"])
            previous = row
            prev2 = previous



print(count_write, count_save, total)
print(len(new_gps_data[1]))
with open('data/gps_clean_condensed.json', 'w') as outfile:
    json.dump(new_gps_data, outfile)