import { type AnimationAction, LoopOnce, AnimationMixer } from "three";
import { generateUUID } from "three/src/math/MathUtils";

interface AnimationQueueItem {
  id: string;
  action: AnimationAction;
  status: AnimationStatus;
}

enum AnimationStatus {
  Queued,
  Playing,
  Finished,
}

export class AvatarAnimationQueueManager {
  private queue: AnimationQueueItem[] = [];
  private isProcessing = false;
  private mixer: AnimationMixer;

  constructor(mixer: AnimationMixer) {
    this.mixer = mixer;
    this.mixer.addEventListener('finished', (e) => { // Use 'finished' event
      if (this.queue.length > 0 && e.action === this.queue[0]!.action) {
        this.queue.shift(); // Remove the completed animation
        this.isProcessing = false;
        this.processQueue();
      }
    });
  }

  enqueue(action: AnimationAction): void {
    this.queue.push({
      id: generateUUID(),
      action,
      status: AnimationStatus.Queued,
    });
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  private processItem(item: AnimationQueueItem): void {
    const { action } = item;
    item.status = AnimationStatus.Playing;
    action.reset().play();
    action.setLoop(LoopOnce, 1);
    action.setEffectiveWeight(1);
    action.setEffectiveTimeScale(1);
    this.isProcessing = true;
    setTimeout(() => {
      item.status = AnimationStatus.Finished;
      this.dequeue(item);
    }, action.time * 1000);
  }

  private dequeue(item: AnimationQueueItem): void {
    const index = this.queue.findIndex((q) => q.id === item.id);
    if (index >= 0) {
      this.queue.splice(index, 1);
    }
    this.isProcessing = false;
    this.processQueue();
  }

  private processQueue(): void {
    while (this.queue.length >= 1) {
      this.processItem(this.queue.shift()!);
    }
  }
}
