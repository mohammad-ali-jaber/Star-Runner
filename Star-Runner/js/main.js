import { loadLevels } from './LevelManager.js';
import { Game } from './Game.js';
import { EventBus } from './EventBus.js';

const canvas=document.getElementById('game-canvas');
const overlayStart=document.getElementById('overlay-start');
const overlayGameover=document.getElementById('overlay-gameover');
const startBtn=document.getElementById('start-btn');
const playAgain=document.getElementById('play-again');
const scoreLabel=document.getElementById('score');
const livesLabel=document.getElementById('lives');
const highLabel=document.getElementById('high');
const gameoverText=document.getElementById('gameover-text');
const errorDiv=document.getElementById('start-error');
const shieldIndicator=document.getElementById('shield-indicator');

let game;

EventBus.on('score', s => scoreLabel.textContent = 'Score: '+s);
EventBus.on('lives', l => livesLabel.textContent = 'Lives: '+l);
EventBus.on('high', h => highLabel.textContent = 'High: '+h);
EventBus.on('shield', active => shieldIndicator.style.display = active?'inline':'none');
EventBus.on('gameover', data=>{
  overlayGameover.classList.remove('hidden');
  gameoverText.textContent=`Game Over\nScore: ${data.score} High: ${data.high}`;
});

startBtn.addEventListener('click', async ()=>{
  errorDiv.textContent='';
  try{
    const levels=await loadLevels();
    if(!levels || !levels.levels) throw new Error('Levels data invalid');
    overlayStart.classList.add('hidden');
    game=new Game(canvas, levels);
    game.start();
  }catch(err){
    console.error(err);
    errorDiv.textContent='Error loading levels: '+err.message+'. استخدم Live Server';
  }
});

playAgain.addEventListener('click', async ()=>{
  overlayGameover.classList.add('hidden');
  try{
    const levels=await loadLevels();
    game=new Game(canvas, levels);
    game.start();
  }catch(err){
    console.error(err);
    errorDiv.textContent='Error loading levels: '+err.message+'. استخدم Live Server';
  }
});
