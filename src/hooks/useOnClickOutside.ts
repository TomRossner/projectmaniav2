import { RefObject, useEffect } from "react";

const useOnClickOutside = (
    ref: RefObject<HTMLElement>,
    handler: (args?: unknown) => void
) => {
    useEffect(() => {
        const handleClick = (ev: MouseEvent) => {
            if (ref.current) {
                if (ref.current !== ev.target /*!ref.current!.contains(ev.target as Node)*/) {
                    console.log("Running handler function")
                    handler();
                }
            }
        }

        document.addEventListener("mousedown", handleClick);

        return () => {
            document.removeEventListener("mousedown", handleClick);
        }
    }, [ref, handler]);
}

export default useOnClickOutside;