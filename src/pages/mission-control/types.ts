export interface Agent {
  id: string;
  name: string;
  role: string;
  color: string;
  emoji: string;
  status: 'working' | 'idle' | 'meeting';
  currentTask?: string;
  lastTask?: string;
}

export type RoomType = 'working' | 'idle' | 'meeting';
