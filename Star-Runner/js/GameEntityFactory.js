import { Enemy, PowerUp } from './GameEntities.js';
export const Factory = {
  createEnemy(canvas,speed){
    const x=Math.random()*(canvas.width-30)+15;
    return new Enemy(x,0,15,speed);
  },
  createPowerUp(canvas){
    const types=['shield','rapid'];
    const x=Math.random()*(canvas.width-30)+15;
    const y=0; 
    const type=types[Math.floor(Math.random()*types.length)];
    const duration=type==='shield'?6000:8000;
    return new PowerUp(x,y,10,type,duration);
  }
};
