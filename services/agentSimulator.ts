import { VideoTask, TaskStatus, AgentAction, AgentLogEntry } from '../types';
import { generateCaption } from './geminiService';

// Helper to create a log entry
export const createLog = (action: AgentAction, message: string): AgentLogEntry => ({
  id: Math.random().toString(36).substr(2, 9),
  timestamp: new Date(),
  action,
  message
});

// Main simulation step function
export const processAgentStep = async (
  tasks: VideoTask[],
  config: any,
  channels: any[],
  addLog: (log: AgentLogEntry) => void,
  updateTask: (id: string, updates: Partial<VideoTask>) => void
) => {
  // Find a pending task or processing task
  const activeTask = tasks.find(t => t.status === TaskStatus.PROCESSING);
  const pendingTask = tasks.find(t => t.status === TaskStatus.PENDING);

  if (activeTask) {
    // Continue processing
    if (activeTask.progress < 100) {
      // Simulation: Increment progress
      const newProgress = activeTask.progress + 10;
      updateTask(activeTask.id, { progress: newProgress });

      // Log intermediate steps
      if (newProgress === 20) addLog(createLog(AgentAction.DOWNLOADING_VIDEO, `Downloading "${activeTask.title}"...`));
      if (newProgress === 50) {
        addLog(createLog(AgentAction.GENERATING_CAPTION, `Analyzing content for "${activeTask.title}"...`));
        const channel = channels.find(c => c.id === activeTask.channelId);
        const caption = await generateCaption(activeTask.title, channel?.name || 'Unknown', config);
        updateTask(activeTask.id, { generatedCaption: caption });
        addLog(createLog(AgentAction.GENERATING_CAPTION, `Caption generated: "${caption.substring(0, 30)}..."`));
      }
      if (newProgress === 80) addLog(createLog(AgentAction.UPLOADING_FACEBOOK, `Uploading to Facebook Page...`));
      
      if (newProgress >= 100) {
        updateTask(activeTask.id, { status: TaskStatus.COMPLETED, progress: 100 });
        addLog(createLog(AgentAction.IDLE, `Successfully posted "${activeTask.title}"`));
      }
    }
  } else if (pendingTask) {
    // Start a new task
    // Check if we can start (scheduling logic mocked here)
    updateTask(pendingTask.id, { status: TaskStatus.PROCESSING, progress: 0 });
    addLog(createLog(AgentAction.DOWNLOADING_VIDEO, `Starting job for "${pendingTask.title}"`));
  }
};
