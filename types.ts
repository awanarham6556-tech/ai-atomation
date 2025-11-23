export enum TaskStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export enum AgentAction {
  ANALYZING_CHANNEL = 'ANALYZING_CHANNEL',
  DOWNLOADING_VIDEO = 'DOWNLOADING_VIDEO',
  GENERATING_CAPTION = 'GENERATING_CAPTION',
  POSTING_LINK = 'POSTING_LINK',
  UPLOADING_FACEBOOK = 'UPLOADING_FACEBOOK',
  IDLE = 'IDLE',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface Channel {
  id: string;
  url: string;
  name: string;
  subscribers: string;
  description: string;
  tags: string[];
}

export interface VideoTask {
  id: string;
  channelId: string;
  title: string;
  status: TaskStatus;
  progress: number; // 0-100
  scheduledTime?: string;
  generatedCaption?: string;
  facebookPageId?: string;
}

export interface FacebookPage {
  id: string;
  name: string;
  followers: number;
  category: string;
  isConnected: boolean;
}

export interface AgentLogEntry {
  id: string;
  timestamp: Date;
  action: AgentAction;
  message: string;
  details?: string;
}

export interface AgentConfig {
  videosPerDay: number;
  postingWindowStart: string; // "09:00"
  postingWindowEnd: string;   // "21:00"
  autoApprove: boolean;
  targetAudience: string;
}