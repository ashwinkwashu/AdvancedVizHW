import csv
import json
import datetime

#outputs sus loyalty data

names = ['Edvard Vann', 'Hideki Cocinaro', 'Stenig Fusil', 'Birgitta Frente', 'Sven Flecha', 'Cornelia Lais', 'Linnea Bergen', 'Mat Bramar', 'Brand Tempestad', 'Emile Arpa', 'Kare Orilla', 'Bertrand Ovan', 'Hennie Osvaldo', 'Nils Calixto', 'Adra Nubarron', 'Rachel Pantanal', 'Lucas Alcazar', 'Varja Lagos', 'Inga Ferro', 'Ruscella Mies Haber', 'Anda Ribera', 'Lidelse Dedos', 'Loreto Bodrogi', 'Minke Mies', 'Felix Resumir', 'Carla Forluniau', 'Kanon Herrero', 'Linda Lagos', 'Dante Coginian', 'Albina Hafon', 'Cecilia Morluniau', 'Varro Awelon', 'Lars Azada', 'Felix Balas', 'Ingrid Barranco', 'Isak Baza', 'Isande Borrasca', 'Axel Calzas', 'Ada Campo-Corrente', 'Gustav Cazar', 'Vira Frente', 'Elsa Orilla', 'Orhan Strum', 'Willem Vasco-Pais', 'Henk Mies', 'Isia Vann', 'Marin Onda', 'Benito Hawelon', 'Valeria Morlun', 'Dylan Scozzese', 'Irene Nant', 'Adan Morlun', 'Claudio Hawelon', 'Sten Sanjorge Jr.']
result = [[0 for i in range(len(names))] for j in range(len(names))]



loyalty = []
with open('data/loyalty_data.csv',encoding="ISO-8859-1") as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        for row in csv_reader:
           loyalty.append([row[1],row[2],row[3],row[4],row[0],'loyal'])

cc = []
with open('data/cc_data.csv',encoding="ISO-8859-1") as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        for row in csv_reader:
           cc.append([row[1],row[2],row[3],row[4],row[0],"cc"])

output = {}

def inc_person(name1,name2):
    p1 = 0
    p2  = 0
    for i in range(len(names)):
        if names[i] == name1:
            p1= i
    for j in range(len(names)):
        if names[j] ==name2:
            p2 = j
    result[p1][p2]+=1



for loyal in loyalty:
    if  loyal[0] in output:
        output[loyal[0]].append(loyal)
    else: 
        output[loyal[0]] =  []
        output[loyal[0]].append(loyal)
for credit in cc:
    if  credit[0] in output:
        output[credit[0]].append(credit)
    else: 
        output[credit[0]] =  []
        output[credit[0]].append(credit)

force_output = {}
force_output["nodes"]  = []
force_output["links"]  = []

for name in names:
    force_output["nodes"].append({"name":name,'group':1})



for place in output:
    if place != "location":
        for transaction in range(1,len(output[place])):
            for transaction2 in range(1,len(output[place])):
                if output[place][transaction][5] != "loyal" and output[place][transaction2][5] != "loyal":
                    time = "0" +output[place][transaction][4]
                    time2 = "0" +output[place][transaction2][4]
                    dt = datetime.datetime.strptime(time, "%m/%d/%Y %H:%M")
                    dt2 = datetime.datetime.strptime(time2, "%m/%d/%Y %H:%M")
                    x = abs(dt-dt2)
                    # 20 minute
                    if x.seconds < 1200:
                        name1 = output[place][transaction][2] +" " +output[place][transaction][3]
                        name2 = output[place][transaction2][2] + " "+output[place][transaction2][3]
                        inc_person(name1,name2)
                elif output[place][transaction][5] == "cc" and output[place][transaction2][5] == "cc" :
                    time = "0" +output[place][transaction][4]
                    time2 = "0" +output[place][transaction2][4]
                    print(time,time2)
                    dt = datetime.datetime.strptime(time, "%m/%d/%Y")
                    dt2 = datetime.datetime.strptime(time2, "%m/%d/%Y")
                    x = abs(dt-dt2)
                    # 20 minute
                    if x.seconds == 0:
                        name1 = output[place][transaction][2] +" " +output[place][transaction][3]
                        name2 = output[place][transaction2][2] + " "+output[place][transaction2][3]
                        inc_person(name1,name2)

for i in range(len(names)):
    for j in range(len(names)):
        if i !=j and result[i][j] >0:
            a  =  {'source': i,'target':j,'value': result[i][j]}
            force_output['links'].append(a)

with open('data/force_loyal_cc2.json', 'w') as outfile:
    json.dump(force_output, outfile)

    # for credit in cc:
    #     if loyal[0] == credit[0] and loyal[1] == credit[1]:
    #         if loyal[2] != credit[2]:
    #             d = credit[4].split(" ")
    #             if d[0] == loyal[4]:
    #                 print(loyal)
    #                 print(credit)
