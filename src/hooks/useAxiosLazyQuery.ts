import { useState } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface AxiosLazyQueryHook<T> {
    loading: boolean;
    error: Error | AxiosError | null
    data: T | null;
    executeFetch: (url: string) => Promise<void>;
}

export const useAxiosLazyQuery = <T>(): AxiosLazyQueryHook<T> => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | AxiosError | null>(null);
    const [data, setData] = useState<T | null>(null);

    const executeFetch = async (url: string): Promise<void> => {
        if (url) {
            setLoading(true);
            setError(null);
            setData(null);

            try {
                const response: AxiosResponse<T> = await axios.get(url);
                setData(response.data);
            } catch (error: unknown) {
                setError(error as Error | AxiosError);
            } finally {
                setLoading(false);
            }
        }
    };

    return { loading, error, data, executeFetch };
};
