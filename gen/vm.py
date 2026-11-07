from g1 import *
def voltmere():
    W,H=24,18;g=Grid(W,H,'~')
    g.rect(0,0,24,1,'T');g.rect(0,17,24,1,'T')
    g.rect(0,0,3,18,'#');g.rect(0,0,1,18,'T')
    g.set(1,8,'K');g.mark('caveMouth',1,8);g.rect(2,7,3,3,'.');g.set(2,8,'=')
    # west plaza platform
    g.rect(4,5,6,7,'.');g.line([(2,8),(9,8)]);g.set(5,6,'s','sign');g.set(8,6,'l')
    # north platform + warden hall
    g.rect(8,1,10,5,'.');g.bld(9,1,8,'Y',4,'gym',rows=3)
    # centre platform: repair caravan
    g.rect(10,8,7,6,'.');g.bld(11,8,5,'U',2,'repair',rows=1)
    # east platform: house + generator + exit
    g.rect(18,3,5,5,'.');g.bld(18,3,4,'R',1,'houseV1')
    g.rect(17,10,7,5,'.');g.rect(19,10,2,2,'M');g.m['gen']=[[19,10],[20,10],[19,11],[20,11]]
    g.line([(17,12),(23,12)]);g.line([(17,13),(23,13)]);g.mark('exitE0',23,12);g.mark('exitE1',23,13);g.mark('eastT0',22,12);g.mark('eastT1',22,13)
    # south-west platform: house 2
    g.rect(3,13,7,3,'.');g.bld(4,12,4,'Q',2,'houseV2',rows=1)
    # boardwalks
    for (a,b) in [((10,7),(10,7)),((13,6),(13,7)),((16,11),(16,11)),((20,8),(20,9)),((17,6),(17,6))]:
        g.line([a,b],'b')
    g.line([(10,7),(13,7)],'b');g.set(17,6,'b');g.set(17,5,'.')
    g.line([(16,12),(16,13)],'b');g.set(9,9,'b');g.set(9,12,'b');g.line([(13,14),(13,15)],'b');g.line([(10,15),(13,15)],'b')
    g.line([(13,11),(13,13)],'=');g.line([(10,10),(16,10)],'=');g.line([(4,8),(9,8)],'=')
    g.set(21,14,'l');g.set(15,13,'l');g.set(4,15,'l')
    g.mark('vm1',18,13);g.mark('vm2',6,10);g.mark('vm3',21,6)
    return g
g=voltmere();g.show('voltmere');done('voltmere',g)
json.dump(OUT,open('vm.json','w'))
