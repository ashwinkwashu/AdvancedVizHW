import csv
import json

locations={}
loc_list = []
with open('data/locations.csv', newline='') as csvfile:
    spamreader = csv.reader(csvfile)
    for row in spamreader:
        if row[1] == "NA" or row[1] == "lat":
            x=1
            # print(row,"will not be tracked")
        else:
            locations[row[0]] = {"lat":row[1],"long": row[2],"history":[]}
            loc_list.append(row[0])

with open('data/gps_clean_condensed.json') as f:
  data = json.load(f)

#loop for all locations/shops
for loc in loc_list:
    #loop for all people
    for i in range(0,40):
        if data[str(i)]:
            #loop through gps data
            for point in data[str(i)]:
                #print(point["long"],locations["Bean There Done That"]["long"])
                if abs(round(float(point["long"]),7) -round(float(locations[loc]["long"]),7)) <0.000009:
                    locations[loc]["history"].append(point)
                    # print(point["long"],locations["Bean There Done That"]["long"])
        
with open('data/gps_sort_place.json', 'w') as outfile:
    json.dump(locations, outfile)

