import { useEffect, useState } from "react"

export default function useDebounced<T>(value: T, delay: number = 250) {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => clearTimeout(handler)
    }, [value, delay]);

    return debouncedValue
}