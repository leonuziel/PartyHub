import { EffectExecutor } from './EffectExecutor';

export class StateTimer {
    private stateEntryTime: number = 0;
    private timerId: NodeJS.Timeout | null = null;
    private effectExecutor: EffectExecutor | null = null;

    public setEffectExecutor(executor: EffectExecutor) {
        this.effectExecutor = executor;
    }

    public onStateEnter() {
        this.stateEntryTime = Date.now();
        this.cancelTimer(); // Ensure any existing timer is cancelled on entering a new state
    }

    public getTimeSinceStateEntry(): number {
        return Date.now() - this.stateEntryTime;
    }

    public startTimer(duration: number, onExpireEffects: any) {
        if (!this.effectExecutor) {
            console.error("EffectExecutor has not been set on StateTimer.");
            return;
        }
        
        this.cancelTimer(); // Cancel any existing timer before starting a new one
        
        // We need a reference to the correct executor instance
        const executor = this.effectExecutor;

        this.timerId = setTimeout(() => {
            this.timerId = null; // Clear the timer ID before executing the callback
            executor.execute(onExpireEffects);
        }, duration * 1000);
    }

    public cancelTimer() {
        if (this.timerId) {
            clearTimeout(this.timerId);
            this.timerId = null;
        }
    }
}
