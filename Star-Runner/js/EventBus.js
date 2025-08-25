export const EventBus = {
  events: {},
  on(event, listener) {
    if(!this.events[event]) this.events[event]=[];
    this.events[event].push(listener);
  },
  emit(event, data) {
    this.events[event]?.forEach(fn => fn(data));
  }
};
