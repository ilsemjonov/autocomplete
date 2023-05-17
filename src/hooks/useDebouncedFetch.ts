import { useEffect, useRef, useState } from 'react';
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

    const loadingRef = useRef<boolean>(false);

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
                if (loadingRef.current) return;
                if (timeoutId) clearTimeout(timeoutId);
                timeoutId = setTimeout(fetchData, debounceTime);
            };

            debounceFetch();

            return () => {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
            };
        }

    }, [url, debounceTime]);

    return { loading, error, data };
};
