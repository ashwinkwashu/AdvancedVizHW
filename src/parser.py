
import csv
import json


poi = ["Carnero", "Barwyn","Parla","Pilau", "Spetson","Arkadiou"," Androutsou","Alfiou","Velestinou","Ermou","Egeou","Ipsilantou","Taxiarchon"]
ndata = []

# max_X = -1000
# min_X = 1000

# max_Y = -1000
# min_Y = 1000

with open('../data/abilia.csv') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        for row in csv_reader:
            flag = 0
            #remove single cordinates
            if len(row[0]) > 26:
                #loop through points of intredst
                for keywords in poi:
                    if keywords in row[1]:
                        #flag if contians POI
                        flag = 1
                coordinates = row[0].split(' ')
                X=[]
                Y=[]
                for coord in coordinates:
                    x, y = coord.split(',')
                    x = float(x)
                    y = float(y)

                    # if x>max_X:
                    #     max_X = x
                    # if x<min_X:
                    #     min_X = x

                    # if y>max_Y:
                    #     max_Y = y
                    # if y<min_Y:
                    #     min_Y = y

                    X+=[x,]
                    Y+=[y,]
                for i in range(len(X)-1):
                    ndata.append({"x1":X[i],"y1":Y[i],"x2":X[i+1],"y2":Y[i+1],"street":row[1],"flag":flag})

# print(min_X, min_Y, max_X, max_Y)

with open('../data/data2.json', 'w') as outfile:
    json.dump(ndata, outfile)