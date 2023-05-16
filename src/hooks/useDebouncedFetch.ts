import { useEffect, useState } from 'react';
import axios, { AxiosResponse, AxiosError } from 'axios';

interface DebouncedFetchHook<T> {
    loading: boolean;
    error: Error | AxiosError | null;
    data: T | null;
};

export const useDebouncedFetch = <T>(url: string, debounceTime: number): DebouncedFetchHook<T> => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | AxiosError | null>(null);
    const [data, setData] = useState<T | null>(null);
    const [prevUrl, setPrevUrl] = useState<string>('');

    useEffect(() => {
        if (url !== '') {
            let timeoutId: NodeJS.Timeout | null = null;

            const fetchData = async () => {
                setLoading(true);

                try {
                    const response: AxiosResponse<T> = await axios.get(url);
                    setData(response.data);
                    setError(null);
                } catch (error: unknown) {
                    setError(error as Error | AxiosError);
                } finally {
                    setLoading(false);
                }
            };

            const debounceFetch = () => {
                if (loading) return;
                if (timeoutId) clearTimeout(timeoutId);
                timeoutId = setTimeout(fetchData, debounceTime);
            };

            if (url !== prevUrl) {
                debounceFetch();
                setPrevUrl(url);
            }

            return () => {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
            };
        } else {
            setPrevUrl(url);
        }

    }, [url, debounceTime, loading]);

    return { loading, error, data };
};
