import { useEffect, useRef } from 'react';

interface AsyncFunction {
    (...args: any[]): Promise<any>;
}

export const useDebouncedAsync = (asyncFunction: AsyncFunction, delay: number): AsyncFunction => {
    const timeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        return () => {
            clearTimeout(timeoutRef.current);
        };
    }, []);

    const debouncedFunction = useRef<AsyncFunction>(async (...args: any[]) => {
        clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(async () => {
            await asyncFunction(...args);
        }, delay);
    });

    return debouncedFunction.current;
};
