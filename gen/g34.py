from g1 import *
import json
def route5():
    g=Grid(34,16,'T');g.rect(1,2,32,11,'.')
    g.rect(0,13,34,3,'~');g.rect(0,15,34,1,'≈');g.rect(0,12,34,1,'.')
    for x in range(0,34,3): g.set(x,12,'.' if x%2 else 'n')
    g.line([(33,10),(20,10),(20,6),(0,6)]);g.line([(33,11),(21,11),(21,7),(0,7)])
    g.mark('exitE0',33,10);g.mark('exitE1',33,11);g.mark('exitW0',0,6);g.mark('exitW1',0,7)
    g.rect(12,2,6,3,'N');g.set(17,3,'J');g.set(12,2,'.')
    g.rect(3,2,7,3,'w');g.rect(23,2,8,4,'j');g.rect(4,9,9,3,'j');g.rect(24,12,6,1,'q')
    for x in range(23,31): g.set(x,8,'<')
    g.mark('pylon',30,6);g.mark('log',9,8);g.mark('item1',2,11);g.mark('item2',31,3)
    g.mark('t1',16,8);g.mark('t2',27,10);g.mark('npc1',6,6)
    for p in [(1,2),(32,2),(1,12),(32,12)]: g.set(*p,'T')
    return g
def saltmarrow():
    g=Grid(28,22,'T');g.rect(1,1,26,16,'.');g.rect(0,17,28,5,'~');g.rect(0,20,28,2,'≈')
    # beached ark = Tide hall
    g.rect(14,2,11,4,'N');g.set(24,3,'J');g.rect(14,6,11,1,'W');g.set(19,6,'D','gym');g.line([(19,7),(19,10)])
    g.line([(27,10),(1,10)]);g.line([(27,11),(1,11)]);g.mark('exitE0',27,10);g.mark('exitE1',27,11);g.mark('exitW0',0,14);g.mark('exitW1',0,15)
    g.line([(1,14),(0,14)]);g.line([(1,15),(0,15)])
    g.bld(3,2,6,'U',2,'repair',rows=1);g.line([(5,4),(5,9)])
    g.bld(3,12,5,'Q',2,'house1',rows=1);g.line([(5,14),(5,15),(12,15),(12,12)])
    g.bld(20,12,5,'R',2,'house2',rows=1);g.line([(22,14),(22,15),(13,15)])
    g.line([(12,11),(12,16)],'=');g.set(12,17,'b');g.set(12,18,'b');g.set(13,18,'b');g.set(14,18,'b');g.mark('dock',14,18)
    g.set(9,5,'l');g.set(17,9,'l');g.set(26,13,'l');g.set(10,12,'s','sign')
    g.mark('npc1',8,8);g.mark('npc2',24,9);g.mark('npc3',16,14);g.mark('kaelSpot',13,10)
    for p in [(1,1),(26,1),(1,16),(26,16)]: g.set(*p,'T')
    g.line([(1,14),(2,14)]);g.line([(1,15),(2,15)])
    return g
def route6():
    g=Grid(32,22,'T');g.rect(1,1,30,19,'.')
    g.rect(0,14,32,8,'~');g.rect(0,18,32,4,'≈')
    # tide flats
    g.rect(6,4,20,8,'_');g.rect(12,6,3,2,'.');g.rect(20,8,3,2,'.');g.rect(8,9,2,2,'.')
    g.line([(31,10),(26,10)]);g.line([(31,11),(26,11)]);g.mark('exitE0',31,10);g.mark('exitE1',31,11)
    g.line([(14,0),(14,3)]);g.line([(15,0),(15,3)]);g.mark('exitN0',14,0);g.mark('exitN1',15,0)
    g.line([(5,4),(5,12),(26,12)]);g.line([(14,3),(5,3)]);g.line([(26,10),(26,12)])
    g.rect(1,12,4,2,'.');g.rect(2,14,3,6,'.');g.line([(3,13),(3,21)]);g.line([(4,13),(4,21)]);g.mark('exitS0',3,21);g.mark('exitS1',4,21)
    g.mark('southT0',3,16);g.mark('southT1',4,16)
    # cathedral islet in rough sea
    g.rect(20,18,4,3,'.');g.set(21,18,'K','cathedral');g.rect(19,21,6,1,'≈')
    g.rect(27,2,3,4,'w');g.rect(1,2,4,4,'q');g.mark('wreck1',13,6);g.mark('wreck2',21,9);g.mark('wreck3',8,10)
    g.mark('t1',18,12);g.mark('t2',28,7);g.mark('npc1',24,13);g.mark('log',2,8);g.mark('alpha',3,3)
    return g
def galecrest():
    g=Grid(24,24,'T');g.rect(1,1,22,22,'.')
    g.rect(1,8,22,3,'C');g.rect(1,16,22,2,'C')
    for y in (8,9,10): g.set(6,y,'+');g.set(17,y,'+')
    for y in (16,17): g.set(11,y,'+')
    g.line([(10,23),(10,18)]);g.line([(11,23),(11,18)]);g.mark('exitS0',10,23);g.mark('exitS1',11,23)
    for x in range(13,21): g.set(x,12,'>')
    for x in range(3,10): g.set(x,6,'<')
    g.bld(8,1,8,'Y',4,'gym',rows=3);g.bld(18,2,4,'R',1,'house1',rows=1);g.bld(2,12,5,'U',3,'repair',rows=1)
    g.line([(12,5),(12,7)]);g.line([(5,14),(5,15)]);g.set(14,19,'s','sign');g.set(20,14,'l');g.set(3,3,'l')
    g.mark('npc1',15,14);g.mark('npc2',4,4);g.mark('npc3',20,20)
    return g
def gym5():
    g=Grid(13,17,'X');g.rect(1,1,11,15,'x');g.set(6,16,'e')
    g.rect(1,4,11,1,'X');g.set(6,4,'x')
    for y in (6,7,8,9,10,11,12,13): 
        for x in range(1,12): g.set(x,y,'_')
    g.rect(1,9,11,1,'X');g.set(2,9,'r');g.set(10,9,'u');g.set(6,9,'X')
    g.set(1,14,'S');g.set(11,7,'x');g.set(1,7,'x');g.set(6,11,'x');g.set(6,7,'x')
    g.mark('maren',6,2);g.mark('t1',3,3);g.mark('guide',10,14)
    return g
def gym6():
    G=[
    'XXXXXXXXXXXXXXX',
    'XxxxxxxxxxxxxxX',
    'XxxxxxxxxxxxxxX',
    'XxxxxxxxxxxxxxX',
    'XXXXXXXXXXXXxXX',
    'XxxxxxxxxxxxxxX',
    'XX>>>>X>>>>>>xX',
    'XXxxxxXxxxxXXXX',
    'Xx<<<<<<<X<<<<X',
    'XxXXXxxxxxxxxXX',
    'XX>>>>>>X>>>>xX',
    'XxxxXXXxxxxXxxX',
    'Xx<<<<<<<<<<<<X',
    'XxxxxxXXXXxxxxX',
    'XX>>>>>>>>X>>xX',
    'XxxxxxxxxxxxxxX',
    'XXXXXXXeXXXXXXX']
    g=Grid(15,17,'X');g.g=[list(r) for r in G]
    g.mark('pell',7,2);g.mark('t1',4,3);g.mark('guide',3,15)
    return g
def cathedral():
    g=Grid(21,20,'X');g.rect(1,1,19,18,'x');g.set(10,19,'e')
    g.rect(1,6,19,1,'X');g.set(4,6,'r');g.set(16,6,'r');g.rect(1,12,19,1,'X');g.set(10,12,'u');g.set(3,12,'r')
    g.set(2,15,'S');g.set(18,9,'S');g.rect(7,1,7,1,'M')
    for y in range(13,18,2): g.set(6,y,'X');g.set(14,y,'X')
    g.mark('cantor',10,2);g.mark('deacon',10,8);g.mark('g1',5,15);g.mark('g2',15,10);g.mark('g3',4,4);g.mark('kaelC',12,14)
    return g
def route7():
    g=Grid(22,40,'T');g.rect(1,1,20,38,'.')
    g.line([(10,0),(10,39)]);g.line([(11,0),(11,39)]);g.mark('exitN0',10,0);g.mark('exitN1',11,0);g.mark('exitS0',10,39);g.mark('exitS1',11,39)
    g.rect(1,8,20,8,'!');g.line([(10,8),(10,15)],'!');g.line([(11,8),(11,15)],'!')
    for p in [(4,10),(8,12),(14,9),(17,13),(12,14),(6,15)]: g.set(*p,'V')
    g.rect(1,24,20,8,';');g.line([(10,24),(10,31)],';');g.line([(11,24),(11,31)],';')
    g.rect(2,2,6,4,'j');g.rect(14,3,6,4,'w');g.rect(2,18,7,4,'q');g.rect(14,18,6,5,'y');g.rect(3,33,6,4,'w');g.rect(14,33,6,4,'d')
    g.rect(13,11,3,2,'G');g.rect(5,27,3,2,'G');g.rect(15,26,3,2,'Z')
    g.mark('t1',6,20);g.mark('t2',16,29);g.mark('log',19,22);g.mark('item1',2,14);g.mark('item2',19,30);g.mark('pylon',3,22);g.mark('alpha',16,20)
    return g
def rimefall():
    g=Grid(24,20,'T');g.rect(1,1,22,18,'.')
    g.line([(10,0),(10,19)]);g.line([(11,0),(11,19)]);g.mark('exitN0',10,0);g.mark('exitN1',11,0);g.mark('exitS0',10,19);g.mark('exitS1',11,19)
    g.bld(13,2,9,'Q',4,'gym',rows=3);g.line([(17,5),(17,8),(11,8)])
    g.bld(2,3,5,'U',2,'repair',rows=1);g.line([(4,5),(4,8),(10,8)]);g.bld(3,12,5,'R',2,'house1',rows=1);g.line([(5,14),(5,15),(10,15)])
    g.rect(14,12,7,5,'-');g.set(17,14,'Z');g.set(12,11,'s','sign');g.set(8,8,'l');g.set(15,10,'l')
    g.mark('npc1',7,10);g.mark('npc2',19,11);g.mark('kaelSpot',11,4)
    for y in range(17,19):
        for x in range(1,23):
            if g.get(x,y)=='.': g.set(x,y,'d')
    return g
def gym7():
    g=Grid(15,17,'X');g.rect(1,1,13,15,'x');g.set(7,16,'e');g.rect(1,4,13,1,'X');g.set(7,4,'x')
    g.rect(1,5,13,10,'-')
    for p in [(7,9),(11,10),(10,5),(6,6),(3,8),(12,7),(2,12),(9,13),(5,11),(12,13)]: g.set(*p,'Z')
    g.rect(1,15,13,1,'x')
    g.mark('yoru',7,2);g.mark('t1',4,3);g.mark('guide',11,15)
    return g
def route8():
    g=Grid(26,30,'T');g.rect(1,1,24,28,'.')
    g.line([(12,0),(12,29)]);g.line([(13,0),(13,29)]);g.mark('exitN0',12,0);g.mark('exitN1',13,0)
    g.rect(1,4,24,6,';');g.line([(12,4),(12,9)],';');g.line([(13,4),(13,9)],';')
    # choir camp
    for (x,y) in [(3,12),(8,12),(17,12)]: g.rect(x,y,3,2,'U')
    g.set(4,13,'W');g.set(9,13,'W');g.set(18,13,'W');g.set(6,15,'*')
    g.rect(2,18,9,4,'y');g.rect(16,18,8,4,'w')
    # summit: spirit shrine + heartforge gate
    g.bld(3,24,7,'#',3,'spirit',rows=2);g.line([(6,27),(6,28),(12,28)])
    g.rect(15,23,9,4,'G');g.set(19,26,'K','hfgate');g.line([(19,27),(19,28),(13,28)])
    g.mark('choir1',10,15);g.mark('choir2',20,15);g.mark('kaelSpot',13,17);g.mark('t1',6,7);g.mark('t2',19,20);g.mark('item1',23,2);g.mark('log',2,20)
    return g
def gym8():
    g=Grid(13,15,'X');g.rect(1,1,11,13,'x');g.set(6,14,'e')
    g.rect(1,4,11,1,'X');g.set(6,4,'g');g.rect(1,8,11,1,'X');g.set(6,8,'g')
    g.set(2,11,'M');g.set(10,11,'M');g.set(2,6,'M');g.set(10,6,'M')
    g.mark('warden',6,2);g.mark('guide',9,12)
    return g
def hf1():
    g=Grid(20,16,'X');g.rect(1,1,18,14,'x');g.set(10,15,'e')
    g.rect(1,5,18,1,'X');g.set(15,5,'r');g.set(4,5,'u');g.rect(1,10,18,1,'X');g.set(9,10,'r');g.set(14,10,'u')
    g.set(2,13,'S');g.set(17,7,'S');g.set(10,1,'E')
    for p in [(6,12),(12,12),(5,7),(13,8),(8,3),(14,2)]: g.set(*p,'V')
    g.mark('g1',6,8);g.mark('g2',15,3);g.mark('item1',18,13)
    return g
def hf2():
    g=Grid(20,16,'X');g.rect(1,1,18,14,'x');g.set(10,15,'O')
    g.rect(2,4,16,1,'4');g.rect(2,8,16,1,'6');g.rect(2,12,16,1,'4')
    g.rect(1,6,18,1,'X');g.set(1,6,'x');g.rect(1,10,18,1,'X');g.set(18,10,'x');g.rect(1,2,18,1,'X');g.set(18,2,'x')
    g.set(3,14,'L');g.set(16,9,'L');g.set(10,1,'E')
    g.mark('g1',9,13);g.mark('g2',8,5);g.mark('item1',1,1)
    return g
def hfcore():
    g=Grid(17,14,'X');g.rect(1,1,15,12,'x');g.set(8,13,'O')
    g.rect(6,2,5,3,'0');g.set(8,4,'J')
    for p in [(2,3),(14,3),(2,9),(14,9)]: g.set(*p,'M')
    g.mark('titan',8,6);g.mark('ally',6,10)
    return g
def hfescape():
    g=Grid(36,9,'X');g.rect(1,1,34,7,'x');g.set(0,4,'x');g.set(35,4,'x')
    for x in range(4,33,4):
        if (x//4)%2: g.rect(x,1,1,3,'X')
        else: g.rect(x,4,1,4,'X')
    for p in [(6,6),(10,2),(18,5),(22,2),(26,6),(30,3)]: g.set(*p,'V')
    g.mark('start',34,4);g.mark('end',0,4)
    return g
O={}
for f in [route5,saltmarrow,route6,galecrest,gym5,gym6,cathedral,route7,rimefall,gym7,route8,gym8,hf1,hf2,hfcore,hfescape]:
    g=f();O[f.__name__]={'grid':g.rows(),'m':g.m}
import sys
if len(sys.argv)>1:
    for n in sys.argv[1:]:
        print('==',n);[print('%2d %s'%(i,r)) for i,r in enumerate(O[n]['grid'])];print(O[n]['m'])
open('../ch34grids.js','w').write('// generated by gen/g34.py\nconst C3G='+json.dumps(O,ensure_ascii=False)+';\nfunction C3(id,k){return C3G[id].m[k];}\n')
