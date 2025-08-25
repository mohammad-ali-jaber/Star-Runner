import { Player, Bullet } from './GameEntities.js';
import { Factory } from './GameEntityFactory.js';
import { EventBus } from './EventBus.js';
import { Storage } from './StorageManager.js';

export class Game {
  constructor(canvas, levelData){
    this.canvas=canvas;
    this.ctx=canvas.getContext('2d');
    this.levels=levelData.levels;
    this.settings=levelData.settings;
    this.player=new Player(canvas.width/2,canvas.height-40,15,4);
    this.bullets=[];
    this.enemies=[];
    this.powerUps=[];
    this.score=0;
    this.high=Storage.getHigh();
    this.level=0;
    this.spawnTimer=null;
    this.lastFire=0;
    this.input={};
    this.levelUpTextTimer=0;
  }

  start(){
    this.bindKeys();
    this.spawnEnemies();
    this.loop();
    EventBus.emit('score', this.score);
    EventBus.emit('lives', this.player.lives);
    EventBus.emit('high', this.high);
  }

  bindKeys(){
    window.addEventListener('keydown', e=>{ this.input[e.code]=true; });
    window.addEventListener('keyup', e=>{ this.input[e.code]=false; });
  }

  spawnEnemies(){
    clearInterval(this.spawnTimer);
    const lvl=this.levels[this.level];
    const spawnInterval=1800/lvl.spawnMul;
    this.spawnTimer=setInterval(()=>{
      this.enemies.push(Factory.createEnemy(this.canvas, lvl.enemySpeedMul*2));
    }, spawnInterval);
  }

  fireBullet(){
    const now=Date.now();
    const fireRate=this.settings.playerFireMs / (this.player.rapid?3:1);
    if(now-this.lastFire>=fireRate){
      this.bullets.push(new Bullet(this.player.x,this.player.y-20,6));
      this.lastFire=now;
    }
  }

  applyShield(){
    if(this.shieldTimer) clearTimeout(this.shieldTimer);
    this.player.isShielded=true;
    EventBus.emit('shield', true);
    this.shieldTimer=setTimeout(()=>{
      this.player.isShielded=false;
      EventBus.emit('shield', false);
    },6000);
  }

  applyRapid(){
    if(this.rapidTimer) clearTimeout(this.rapidTimer);
    this.player.rapid=true;
    this.rapidTimer=setTimeout(()=>this.player.rapid=false,8000);
  }

  nextLevel(){
    if(this.level<this.levels.length-1) this.level++;
    this.levelUpTextTimer=Date.now();
    this.spawnEnemies();
  }

  update(){
    if(this.input['ArrowLeft']||this.input['KeyA']) this.player.move(-this.player.speed,0,this.canvas);
    if(this.input['ArrowRight']||this.input['KeyD']) this.player.move(this.player.speed,0,this.canvas);
    if(this.input['ArrowUp']||this.input['KeyW']) this.player.move(0,-this.player.speed,this.canvas);
    if(this.input['ArrowDown']||this.input['KeyS']) this.player.move(0,this.player.speed,this.canvas);
    if(this.input['Space']) this.fireBullet();

    this.bullets.forEach((b,i)=>{ b.update(); if(b.y<0) this.bullets.splice(i,1); });

    this.enemies.forEach((e,ei)=>{
      e.update();
      const dx=e.x-this.player.x, dy=e.y-this.player.y;
      if(Math.hypot(dx,dy)<e.r+this.player.r && !this.player.isShielded){
        this.enemies.splice(ei,1);
        this.player.lives--;
        EventBus.emit('lives', this.player.lives);
        if(this.player.lives<=0) this.restartGame();
      }

      this.bullets.forEach((b,bi)=>{
        if(Math.hypot(e.x-b.x,e.y-b.y)<e.r+b.r){
          this.enemies.splice(ei,1);
          this.bullets.splice(bi,1);
          this.score+=10;
          EventBus.emit('score', this.score);

          if(Math.random()<this.levels[this.level].drop){
            this.powerUps.push(Factory.createPowerUp(this.canvas));
          }

          if(this.score % 200 === 0) this.nextLevel();
        }
      });
    });

    this.powerUps.forEach((p,pi)=>{
      p.y+=2;
      if(Math.hypot(p.x-this.player.x,p.y-this.player.y)<p.r+this.player.r){
        if(p.type==='shield') this.applyShield();
        if(p.type==='rapid') this.applyRapid();
        this.powerUps.splice(pi,1);
      }
      else if(p.y>this.canvas.height) this.powerUps.splice(pi,1);
    });
  }

  draw(){
    const ctx=this.ctx;
    ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    this.player.draw(ctx);
    this.bullets.forEach(b=>b.draw(ctx));
    this.enemies.forEach(e=>e.draw(ctx));
    this.powerUps.forEach(p=>p.draw(ctx));

    if(this.levelUpTextTimer && Date.now()-this.levelUpTextTimer<1000){
      ctx.fillStyle='white';
      ctx.font='40px Arial';
      ctx.textAlign='center';
      ctx.fillText('LEVEL UP!', this.canvas.width/2, this.canvas.height/2);
    }
  }

  loop(){
    this.update();
    this.draw();
    if(this.player.lives>0){
      requestAnimationFrame(()=>this.loop());
    }
  }

 restartGame(){
  if(this.score>this.high) Storage.setHigh(this.score);
  EventBus.emit('gameover', { score: this.score, high: Storage.getHigh() });
  this.player.lives=0;
}

}