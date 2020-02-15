
import csv

people  =  []
ids = []
with open('data/car-assignments.csv') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        for row in csv_reader:
            x = row[1] + " " + row[0]
            if len(str(row[2])) > 0:
                name.append(x)
                ids.append(row[2])

print(name)
print(ids)