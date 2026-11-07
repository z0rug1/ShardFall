from g1 import *
def brasston():
    W,H=28,24;g=Grid(W,H,'T')
    g.rect(2,1,24,21,'.')
    # terrace cliffs
    g.rect(2,7,24,1,'G');g.rect(2,14,24,1,'G')
    g.set(12,7,'H');g.set(13,7,'H');g.set(4,14,'H');g.set(14,14,'H');g.set(15,14,'H');g.set(23,14,'H')
    # upper terrace: warden hall + mine
    g.bld(8,1,9,'Y',4,'gym',rows=3)
    g.rect(19,1,5,2,'G');g.set(21,2,'K');g.mark('mine',21,2)
    g.set(3,2,'Z');g.set(24,4,'Z');g.set(4,5,'i','iceLoot');g.set(18,5,'s','gymSign')
    g.line([(12,5),(12,6)]);g.line([(13,5),(13,6)])
    # middle terrace
    g.line([(12,8),(12,11),(25,11)]);g.line([(13,8),(13,10),(25,10)]);g.mark('exitE0',27,10);g.mark('exitE1',27,11)
    g.set(26,10,'=');g.set(27,10,'=');g.set(26,11,'=');g.set(27,11,'=')
    g.bld(3,8,5,'Q',2,'houseB1');g.line([(5,11),(5,12),(11,12)])
    g.rect(16,12,1,1,'l');g.set(9,9,'l');g.set(21,8,'f');g.set(22,8,'f');g.set(23,8,'f')
    g.mark('guardTrig0',26,10);g.mark('guardTrig1',26,11);g.mark('guard',25,12)
    g.mark('grunt0',19,12);g.mark('eng',21,13);g.mark('bwoman',8,10)
    # lower terrace
    g.line([(14,15),(14,23)]);g.line([(15,15),(15,23)]);g.mark('exitS0',14,23);g.mark('exitS1',15,23)
    g.rect(14,22,2,2,'=')
    g.bld(3,16,6,'U',2,'repair',rows=1);g.line([(5,18),(5,19),(13,19)])
    g.bld(19,16,5,'R',2,'houseB2');g.line([(21,19),(16,19)])
    g.set(10,17,'l');g.set(18,21,'l');g.mark('bkid',9,20)
    g.rect(3,20,4,1,'f');g.set(24,20,'Z');g.set(23,21,'Z')
    for p in [(2,21),(25,21),(25,15),(2,15),(25,1),(2,1)]: g.set(p[0],p[1],'T')
    return g
g=brasston();g.show('brasston');done('brasston',g)
json.dump(OUT,open('br.json','w'))
