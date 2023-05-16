import { useEffect, useState } from 'react';
import axios, { AxiosResponse, AxiosError } from 'axios';

type ApiResponse<T> = {
    data: T;
};

const useAxiosFetch = <T>(url: string) => {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<Error | AxiosError | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const response: AxiosResponse<ApiResponse<T>> = await axios.get(url);
                setData(response.data.data);
                setError(null);
            } catch (error: unknown) {
                setError(error as Error | AxiosError);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

    return { error, loading, data };
};

export default useAxiosFetch;
