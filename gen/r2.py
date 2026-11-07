from g1 import *
def route2():
    W,H=34,20;g=Grid(W,H,'T')
    g.rect(1,1,32,18,'.')
    for y in range(1,19):
        if y%5==0: g.set(1,y,'T')
        if y%6==2: g.set(32,y,'T')
    # west entry
    g.line([(0,8),(6,8)]);g.line([(0,9),(6,9)]);g.mark('exitW0',0,8);g.mark('exitW1',0,9)
    # frozen lake (slide puzzle) north-centre
    g.blob(15,5,9,4.2,'-',only='.')
    for p in [(10,3),(19,2),(13,7),(21,6),(8,5),(17,9),(23,4)]: g.set(*p,'Z')
    g.rect(15,4,2,2,'.');g.mark('stash',16,4);g.mark('lakeItem',15,5)
    # chasm and titan skeleton
    g.rect(25,0,4,20,'C')
    for x in range(25,29): g.set(x,11,'A')
    g.mark('spine',25,11)
    for (x,y) in [(24,9),(24,13),(29,9),(29,13),(23,10),(30,12)]: g.set(x,y,'B')
    # main path
    g.line([(6,8),(6,11),(24,11)]);g.line([(29,11),(33,11)]);g.mark('exitE',33,11)
    # east side of chasm
    g.rect(30,2,2,3,'q');g.set(30,1,'m','terminal');g.mark('cache',31,5)
    g.set(30,8,'i','iceLoot');g.mark('r2s',29,17);g.rect(30,14,2,4,'y')
    # south bands
    g.rect(3,13,6,5,'w');g.rect(11,13,7,5,'y');g.rect(19,14,5,4,'q')
    g.set(10,16,'Z');g.set(18,13,'Z')
    g.set(2,17,'n','grotto');g.mark('r2p',4,12)
    g.mark('pylon',9,9);g.mark('alpha',14,15);g.mark('dov',12,12);g.mark('sela',22,12);g.mark('r2girl',24,8)
    g.m['kaelT']=[[20,y] for y in range(9,19) if g.get(20,y) not in 'TZCB']
    return g
g=route2();g.show('route2');done('route2',g)
json.dump(OUT,open('r2.json','w'))
