export const Storage = {
  getHigh() {
    return Number(localStorage.getItem('sr_high')||0);
  },
  setHigh(score) {
    localStorage.setItem('sr_high', score);
  }
};
