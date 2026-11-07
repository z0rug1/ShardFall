import json
class Grid:
    def __init__(s,w,h,fill): s.w,s.h=w,h;s.g=[[fill]*w for _ in range(h)]
    def rect(s,x,y,w,h,c):
        for yy in range(y,y+h):
            for xx in range(x,x+w):
                if 0<=xx<s.w and 0<=yy<s.h: s.g[yy][xx]=c
    def set(s,x,y,c): s.g[y][x]=c
    def hpath(s,x0,x1,y,c='='):
        for x in range(min(x0,x1),max(x0,x1)+1): s.g[y][x]=c
    def vpath(s,x,y0,y1,c='='):
        for y in range(min(y0,y1),max(y0,y1)+1): s.g[y][x]=c
    def building(s,x,y,w,roof,door_dx,rows=2):
        s.rect(x,y,w,rows,roof); s.rect(x,y+rows,w,1,'W'); s.set(x+door_dx,y+rows,'D'); return (x+door_dx,y+rows)
    def rows(s): return [''.join(r) for r in s.g]
out={}
# ---------------- ROUTE 3 (36x14) ----------------
r=Grid(36,14,'T')
r.rect(2,2,32,10,'.')
r.rect(3,2,6,3,',');r.rect(22,8,7,3,',');r.rect(12,9,6,2,',');r.rect(27,2,5,3,',')
r.hpath(0,35,6);r.hpath(0,35,7)
for x in (0,1,34,35):
    for y in range(14):
        if y not in (6,7): r.set(x,y,'T')
r.rect(10,1,10,3,'U');r.rect(10,4,10,1,'W');r.set(14,4,'D');r.vpath(14,5,5)
r.rect(23,3,3,2,'~')
r.set(33,10,'T');r.set(2,11,'T')
r.set(21,3,'i')   # ice block w/ loot
r.rect(31,9,2,2,'T')
out['route3']=r.rows()
# ---------------- RUSTWORKS (26x18) ----------------
g=Grid(26,18,'X')
g.rect(1,1,24,3,'x')                    # boss room y1..3
g.set(24,4,'x')                         # opening up at x24
g.set(1,5,'x');g.set(24,5,'x');g.rect(2,5,22,1,'4')   # belt west (default)
g.rect(1,6,9,1,'x')                     # left platform y6
g.set(1,7,'x')                          # opening at x1
g.set(1,8,'x');g.set(24,8,'x');g.rect(2,8,22,1,'6')   # belt east
g.rect(20,9,5,1,'x');g.set(19,9,'L')    # right platform + lever
g.set(24,10,'x')
g.set(1,11,'x');g.set(24,11,'x');g.rect(2,11,22,1,'6')# belt east
g.set(1,12,'x')
g.rect(1,13,24,4,'x');g.set(3,14,'L')   # start area + lever
g.set(12,17,'e')
g.set(5,13,'M');g.set(20,15,'M');g.set(8,1,'M');g.set(17,1,'M')
out['rustworks']=g.rows()
# ---------------- FERROW (24x18) ----------------
f=Grid(24,18,'T')
f.rect(2,1,20,16,'.')
gd=f.building(3,2,7,'Y',3)              # gym door (6,4)
hd=f.building(14,2,5,'R',2)             # house (16,4)
rd=f.building(13,8,4,'Q',1,rows=2)      # repair door (14,10)
h2=f.building(3,8,4,'R',1,rows=2)       # house2 door (4,10)
f.hpath(0,12,12,'=');f.hpath(0,12,13,'=')
for x in (0,1):
    for y in range(18):
        if y not in (12,13): f.set(x,y,'T')
f.vpath(11,5,13);f.hpath(6,11,5);f.hpath(11,15,7)
f.vpath(11,13,17);f.vpath(12,13,17);f.rect(10,17,4,1,'=');f.vpath(10,15,17);f.vpath(13,15,17)
for x in range(24):
    if x not in (10,11,12,13): f.set(x,17,'T')
f.rect(18,10,2,2,'M');f.rect(19,13,2,2,'M');f.set(8,9,'l');f.set(16,13,'l');f.set(9,5,'s')
f.rect(18,6,3,1,'F')
out['ferrow']=f.rows()
# ---------------- GYM 3 (13x15) crates on belts ----------------
g3=Grid(13,15,'X')
g3.rect(1,1,11,3,'x');g3.rect(5,4,3,1,'g');g3.rect(1,5,11,9,'x')
g3.rect(4,6,6,1,'6');g3.set(10,6,'P')
g3.rect(5,8,5,1,'6');g3.set(10,8,'P')
g3.set(3,10,'C');g3.set(6,11,'C')
g3.set(1,9,'M');g3.set(11,11,'M')
g3.set(6,14,'e')
out['gym3']=g3.rows()
# ---------------- ROUTE 4 (20x34) ----------------
r4=Grid(20,34,'T')
r4.rect(2,1,16,32,'.')
r4.rect(8,0,4,1,'=');r4.vpath(9,0,33);r4.vpath(10,0,33)
for y in range(34):
    for x in (0,1,18,19): r4.set(x,y,'T')
r4.rect(3,3,5,4,',');r4.rect(12,5,5,4,',');r4.rect(3,22,5,5,',');r4.rect(12,24,5,5,',')
# geyser choke: rows 13-17 narrow pass with vents
r4.rect(2,13,16,5,'#');r4.rect(7,13,6,5,'.');r4.vpath(9,13,17);r4.vpath(10,13,17)
for (x,y) in [(8,14),(9,14),(10,15),(11,15),(9,16),(10,16),(8,17),(11,13),(7,15)]: r4.set(x,y,'V')
r4.rect(3,19,3,2,'~')
r4.set(16,20,'i');r4.rect(15,30,3,2,'T')
r4.rect(8,33,4,1,'=')
out['route4']=r4.rows()
# ---------------- KILNHAVEN (24x18) ----------------
k=Grid(24,18,'T')
k.rect(2,2,20,15,'.')
k.rect(8,0,4,2,'=');k.vpath(9,0,12);k.vpath(10,0,12)
kd=k.building(13,3,8,'Y',3)             # gym door (16,6)
kr=k.building(3,8,4,'Q',1,rows=2)       # repair (4,10)
kh=k.building(3,3,4,'R',1,rows=2)       # house (4,5)
k.hpath(5,10,11);k.hpath(10,16,7)
k.rect(14,12,5,3,'~');k.set(16,13,'b')  # hot spring
k.set(12,12,'l');k.set(7,6,'l');k.set(11,5,'s')
k.rect(3,13,3,2,'M')
out['kilnhaven']=k.rows()
# ---------------- GYM 4 (13x15) steam vents ----------------
g4=Grid(13,15,'X')
g4.rect(1,1,11,3,'x');g4.rect(1,4,11,1,'x')
for x in range(13):
    if x not in range(1,12): g4.set(x,4,'X')
g4.rect(1,5,11,9,'x')
for (x,y) in [(2,6),(3,6),(4,6),(5,6),(7,6),(8,6),(9,6),(10,6),(6,8),(2,8),(4,8),(8,8),(10,8),(3,10),(5,10),(7,10),(9,10),(6,12),(1,12),(11,12),(4,12),(8,12)]: g4.set(x,y,'V')
g4.rect(0,4,1,1,'X');g4.rect(12,4,1,1,'X')
g4.rect(1,4,4,1,'X');g4.rect(8,4,4,1,'X')
g4.set(6,14,'e')
out['gym4']=g4.rows()
json.dump(out,open('grids.json','w'),indent=0)
for k_,v in out.items(): print(k_,len(v[0]),len(v),'door rows:',[ (y,r_.find('D')) for y,r_ in enumerate(v) if 'D' in r_])
