import json,math
class Grid:
    def __init__(s,w,h,fill): s.w,s.h=w,h;s.g=[[fill]*w for _ in range(h)];s.m={}
    def rect(s,x,y,w,h,c):
        for yy in range(y,y+h):
            for xx in range(x,x+w):
                if 0<=xx<s.w and 0<=yy<s.h: s.g[yy][xx]=c
    def set(s,x,y,c,mark=None):
        s.g[y][x]=c
        if mark: s.m[mark]=[x,y]
    def get(s,x,y): return s.g[y][x]
    def mark(s,name,x,y): s.m[name]=[x,y]
    def line(s,pts,c='='):
        for (x0,y0),(x1,y1) in zip(pts,pts[1:]):
            if x0==x1:
                for y in range(min(y0,y1),max(y0,y1)+1): s.g[y][x0]=c
            else:
                for x in range(min(x0,x1),max(x0,x1)+1): s.g[y0][x]=c
    def bld(s,x,y,w,roof,ddx,name,rows=2):
        s.rect(x,y,w,rows,roof);s.rect(x,y+rows,w,1,'W');s.set(x+ddx,y+rows,'D',name);return (x+ddx,y+rows)
    def blob(s,cx,cy,rx,ry,c,only=None):
        for y in range(s.h):
            for x in range(s.w):
                if ((x-cx)/rx)**2+((y-cy)/ry)**2<=1 and (only is None or s.g[y][x] in only): s.g[y][x]=c
    def rows(s): return [''.join(r) for r in s.g]
    def show(s,n):
        print('==',n,s.w,s.h);[print('%2d %s'%(i,r)) for i,r in enumerate(s.rows())];print(s.m)
OUT={}
def done(n,g): OUT[n]={'grid':g.rows(),'m':g.m}
