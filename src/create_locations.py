import pandas as pd

location = []
lat = []
lng = []

with open('../data/all_locations.txt') as locs:
    line = locs.readline()
    while line:
        line_data = line.split(": ")
        location.append(line_data[0])
        coords = line_data[1][line_data[1].find("[")+1:line_data[1].find("]")]
        lng.append(coords.split(', ')[0])
        lat.append(coords.split(', ')[1])
        line = locs.readline()

data = pd.DataFrame({'location': location, 'lat': lat, 'long': lng})
data.to_csv('../data/locations.csv', index = None, header=True)