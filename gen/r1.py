from g1 import *
def route1():
    W,H=26,40;g=Grid(W,H,'T')
    g.rect(2,2,22,36,'.')
    # ragged edges
    for y in range(2,38):
        for x in (2,23):
            if (y*7+x)%5==0: g.set(x,y,'T')
        if y%9 in (0,1): g.set(3,y,'T')
        if y%11 in (4,5): g.set(22,y,'T')
    g.line([(12,0),(12,10)]);g.line([(13,0),(13,1)]);g.mark('exitN0',12,0);g.mark('exitN1',13,0)
    # upper meadow
    g.rect(4,3,6,4,'y');g.rect(16,4,6,5,'w');g.rect(11,4,1,3,'d')
    g.mark('pylon',20,3);g.mark('mara',9,8)
    # wreck site
    g.rect(5,10,17,9,'j')
    g.rect(9,12,7,4,'N');g.set(9,12,'j');g.set(15,15,'j');g.set(16,13,'N');g.set(16,14,'J');g.set(17,14,'J');g.set(8,14,'N');g.rect(11,16,3,1,'N')
    g.line([(12,10),(12,11)]);g.line([(6,10),(18,10)])
    g.line([(6,10),(6,19)]);g.line([(19,10),(19,19)]);g.line([(6,19),(19,19)]);g.line([(12,19),(12,21)])
    g.mark('alpha',8,17);g.mark('lou',13,18)
    g.set(20,12,'Z');g.set(7,12,'Z');g.set(18,17,'Z')
    # ice slide field west (enter from (6,13)->west)
    g.rect(2,11,3,7,'-');g.set(3,11,'T');g.set(2,14,'Z');g.mark('slideItem',2,17);g.set(4,17,'.')
    # lake + islet
    g.rect(14,23,8,5,'~');g.set(14,23,'.');g.set(21,27,'.');g.set(19,25,'.');g.mark('islet',19,25)
    g.set(13,24,'i','iceLoot')
    g.line([(12,21),(12,33)])
    # crystal beds west + grotto
    g.rect(3,22,7,7,'q');g.set(1,25,'z','grotto');g.set(2,25,'.');g.set(3,25,'.');g.mark('lostbot',4,27)
    g.mark('gale',22,24);g.set(22,24,'.')
    # lower: drifts
    g.rect(4,31,5,4,'d');g.rect(16,30,6,4,'d');g.rect(15,34,7,2,'q')
    g.mark('patch',5,30);g.mark('spike',21,32)
    g.mark('hiker',8,33);g.set(14,35,'s','sign');g.line([(12,33),(12,39)]);g.line([(13,37),(13,39)]);g.set(13,36,'=');g.set(13,37,'=')
    g.mark('exitS0',12,39);g.mark('exitS1',13,39);g.mark('mara2',17,28)
    return g
g=route1();g.show('route1');done('route1',g)
json.dump(OUT,open('r1.json','w'))
