import csv
#outputs sus loyalty data
loyalty = []
with open('data/loyalty_data.csv',encoding="ISO-8859-1") as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        for row in csv_reader:
           loyalty.append([row[1],row[2],row[3],row[4],row[0]])

cc = []
with open('data/cc_data.csv',encoding="ISO-8859-1") as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        for row in csv_reader:
           cc.append([row[1],row[2],row[3],row[4],row[0]])

for loyal in loyalty:
    for credit in cc:
        if loyal[0] == credit[0] and loyal[1] == credit[1]:
            if loyal[2] != credit[2]:
                d = credit[4].split(" ")
                if d[0] == loyal[4]:
                    print(loyal)
                    print(credit)
                    print("**")