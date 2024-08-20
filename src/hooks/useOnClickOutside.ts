import { RefObject, useEffect } from "react";

const useOnClickOutside = (
    ref: RefObject<HTMLElement>,
    handler: (args?: unknown) => void
) => {
    useEffect(() => {
        const handleClick = (ev: MouseEvent) => {
            if (ref.current) {
                if ((ev.target as Node).contains(ref.current as Node)) {
                    console.log("Running handler function");
                    handler();
                }
                
                // if (ev.target !== ref.current) {
                //     handler();
                // }
            }
        }

        document.addEventListener("click", handleClick);

        return () => {
            document.removeEventListener("click", handleClick);
        }
    }, [ref, handler]);
}

export default useOnClickOutside;