from g1 import *
def ashgrove():
    g=Grid(30,22,'T')
    cx,cy,rx,ry=14.5,11.5,13.6,9.6
    for y in range(22):
        for x in range(30):
            d=((x-cx)/rx)**2+((y-cy)/ry)**2
            if d<=0.78: g.set(x,y,'.')
            elif d<=1.0: g.set(x,y,'G')
    # north rim stairs and exit
    for y in range(0,4):
        for x in (14,15):
            if g.get(x,y) in 'TG': g.set(x,y,'=' if y<2 else 'H')
    g.mark('exitN0',14,0);g.mark('exitN1',15,0)
    # crash site north-east of tower
    g.rect(16,4,4,2,'d');g.set(19,4,'Z');g.set(16,5,'Z');g.mark('capsule',18,5)
    # relay tower
    g.rect(14,8,2,3,'0');g.mark('tower',14,10)
    # plaza path ring
    g.line([(14,3),(14,7),(11,7),(11,12),(18,12),(18,7),(15,7)])
    g.set(15,3,'=');g.line([(15,3),(15,7)])
    # workshop (player) west
    d=g.bld(3,11,5,'Q',2,'workshopDoor');g.line([(5,14),(5,15),(11,15),(11,12)])
    # field station east (Vesna)
    d=g.bld(21,11,6,'Y',2,'labDoor');g.line([(23,14),(23,15),(18,15),(18,12)])
    # miner house NW, astronomer NE
    g.bld(6,5,4,'R',1,'houseA');g.line([(7,8),(7,9),(11,9)])
    g.bld(20,6,4,'R',2,'houseB');g.line([(22,9),(18,9)])
    # frozen pond south with skating kids
    g.blob(14.5,18,4.2,1.8,'-',only='.')
    g.line([(14,12),(14,16)])
    g.set(12,13,'s','sign');g.set(9,12,'l');g.set(20,12,'l');g.set(13,5,'l');g.set(17,16,'l')
    for p in [(3,9),(26,10),(4,16),(25,15),(9,19),(20,19)]:
        if g.get(*p)=='.': g.set(p[0],p[1],'T')
    g.set(8,16,'Z');g.set(25,9,'Z')
    g.mark('start',5,14)
    return g
g=ashgrove();g.show('ashgrove');done('ashgrove',g)
json.dump(OUT,open('ash.json','w'))
