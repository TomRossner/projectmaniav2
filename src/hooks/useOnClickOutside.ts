import { RefObject, useEffect } from "react";

const useOnClickOutside = (
    refs: RefObject<HTMLElement>[],
    handler: () => void
) => {
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (refs?.every(ref => ref.current?.contains(e.target as Node))) {
                handler();
            }
        }

        document.addEventListener("click", handleClick);
        return () => {
            document.removeEventListener("click", handleClick);
        }
    }, [refs, handler]);
}

export default useOnClickOutside;