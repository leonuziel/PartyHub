export class StateTimer {
    private stateEntryTime: number = 0;
    private timerId: NodeJS.Timeout | null = null;

    public onStateEnter() {
        this.stateEntryTime = Date.now();
        this.cancelTimer(); // Ensure any existing timer is cancelled on entering a new state
    }

    public getTimeSinceStateEntry(): number {
        return Date.now() - this.stateEntryTime;
    }

    public startTimer(duration: number, onExpireCallback: () => void) {
        this.cancelTimer(); // Cancel any existing timer before starting a new one
        this.timerId = setTimeout(() => {
            this.timerId = null; // Clear the timer ID before executing the callback
            onExpireCallback();
        }, duration * 1000);
    }

    public cancelTimer() {
        if (this.timerId) {
            clearTimeout(this.timerId);
            this.timerId = null;
        }
    }
}
