import { Invalidator, Unsubscriber, Updater, Writable } from 'svelte/store';

export type Subscriber<T, U> = (value: T, action?: U) => void;

export type Reducer<T, U> = (store: T, action: U) => T;

export class Store<T, U> implements Writable<T> {
    private value: T;
    private subscribers: Set<Subscriber<T, U>> = new Set();

    constructor(initialValue: T, reducer?: Reducer<T, U>) {
        this.value = initialValue;
        if (reducer) this.reducer = reducer;
    }

    getValue(): T {
        return this.value;
    }

    dispatch(action: U) {
        this.value = this.reducer(this.value, action);
        this.notifySubscribers(action);
    }

    set(value: T): void {
        this.value = value;
        this.notifySubscribers();
    }

    subscribe(
        run: Subscriber<T, U>,
        invalidate?: Invalidator<T>,
    ): Unsubscriber {
        this.subscribers.add(run);
        run(this.value);
        return () => {
            this.subscribers.delete(run);
        };
    }

    update(updater: Updater<T>): void {
        this.value = updater(this.value);
        this.notifySubscribers();
    }

    private readonly reducer: Reducer<T, U> = () => this.value;

    private notifySubscribers(action?: U): void {
        for (const subscriber of this.subscribers) {
            subscriber(this.value, action);
        }
    }
}
