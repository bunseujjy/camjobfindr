import { useEffect, useState } from "react"

export default function useDimension(containerRef: React.RefObject<HTMLDivElement | null>) {
    const [dimension, setDimension] = useState({width: 0, height: 0})

    useEffect(() => {
        const currentRef = containerRef.current;

        function getDimension() {
            return {                
                width: currentRef?.offsetWidth || 0,
                height: currentRef?.offsetHeight || 0,
            }
        }
        
        const resizeObserver = new ResizeObserver(entries => {
            const entry = entries[0]
            if (entry) {
                setDimension(getDimension())
            }
        })

        if(currentRef) {
            resizeObserver.observe(currentRef)
            setDimension(getDimension())
        }
        return () => {
            if(currentRef) {
                resizeObserver.unobserve(currentRef)
            }
            resizeObserver.disconnect()
        }
    }, [containerRef])

    return dimension
}