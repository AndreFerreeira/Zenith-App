import { EventEmitter } from 'events';

// This is a global event emitter to handle specific errors application-wide.
export const errorEmitter = new EventEmitter();
