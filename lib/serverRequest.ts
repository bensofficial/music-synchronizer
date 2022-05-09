import {useEffect, useState} from "react";

export function useGetRequest<T>(uri: string, authOptions: RequestInit) {
    const { error, errorMessage, data, send } = useRequest<T>(uri);

    useEffect(() => {
        send(authOptions);
    })

    return { error, errorMessage, data }
}

function useRequest<T>(uri: string) {
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [data, setData] = useState<T | null>(null);

    function send(authOptions: RequestInit) {

        /*
        A second error var has to be used to store whether the request failed or not.
        If the information is saved in the state "error" it wont have updated once the response body
        is parsed and the errorMessage wont be extracted
        */
        let reqError = false;
        /*
        Chained callback functions must be used here instead of await.
        Otherwise the states (loading, error, data, etc..) wouldn't update correctly
        */

        fetch(uri, authOptions).then((res) => {
            setError(!res.ok);
            reqError = !res.ok;
            return res.json();
        }).then((data) => {
            if (reqError) {
                /*
                Surrounded with a try catch expr since its not sure
                if this value exists on the response data
                */
                try {
                    setErrorMessage(data.errors[0].message);
                } catch (e) {}
            }

            setData(data);
        });
    }

    return { error, errorMessage, data, send };
}