"use client";

import { useEffect } from "react";

export default function FarcasterInit() {
    useEffect(() => {
        let attempts = 0;
        const maxAttempts = 20;

        const init = () => {
            try {
                // @ts-ignore
                if (window.sdk && window.sdk.actions) {
                    // @ts-ignore
                    window.sdk.actions.ready();
                    console.log("Farcaster SDK Ready called successfully");
                } else {
                    attempts++;
                    if (attempts < maxAttempts) {
                        setTimeout(init, 100);
                    } else {
                        console.warn("Farcaster SDK not found after max attempts");
                    }
                }
            } catch (e) {
                console.error("SDK Init Error", e);
            }
        };

        init();
    }, []);

    return null;
}
