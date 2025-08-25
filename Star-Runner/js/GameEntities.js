export class Entity {
  constructor(x,y,r){ this.x=x; this.y=y; this.r=r; }
  draw(ctx){}
  update(){}
}

export class Player extends Entity {
  constructor(x,y,r,speed){
    super(x,y,r);
    this.speed=speed;
    this.lives=3;
    this.isShielded=false;
    this.rapid=false;
  }
  draw(ctx){
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.r,0,2*Math.PI);
    ctx.fillStyle='cyan';
    ctx.fill();
  }
  move(dx,dy,canvas){
    this.x=Math.max(this.r,Math.min(canvas.width-this.r,this.x+dx));
    this.y=Math.max(this.r,Math.min(canvas.height-this.r,this.y+dy));
  }
}

export class Enemy extends Entity {
  constructor(x,y,r,speed){ super(x,y,r); this.speed=speed; }
  draw(ctx){
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.r,0,2*Math.PI);
    ctx.fillStyle='red';
    ctx.fill();
  }
  update(){ this.y+=this.speed; }
}

export class Bullet extends Entity {
  constructor(x,y,v){ super(x,y,3); this.v=v; }
  draw(ctx){
    ctx.fillStyle='white';
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.r,0,2*Math.PI);
    ctx.fill();
  }
  update(){ this.y-=this.v; }
}

export class PowerUp extends Entity {
  constructor(x,y,r,type,duration){
    super(x,y,r);
    this.type=type;
    this.duration=duration;
  }
  draw(ctx){
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.r,0,2*Math.PI);
    ctx.fillStyle=this.type==='shield'?'#98ff98':'#3af';
    ctx.fill();
  }
}
