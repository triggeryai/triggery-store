"use client";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import React, { useEffect, useState } from "react";

export default function GoogleCaptchaWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const [recaptchaKey, setRecaptchaKey] = useState<string>("off_captcha"); // Domyślnie ustaw na "off_captcha"
    const [isCaptchaEnabled, setIsCaptchaEnabled] = useState<boolean>(false); // Domyślnie false

    useEffect(() => {
        const fetchCaptchaStatus = async () => {
            try {
                // Pobranie statusu Captcha i klucza z API
                const res = await fetch('/api/captcha-status');
                const data = await res.json();

                if (data.success) {
                    setIsCaptchaEnabled(data.data.isCaptchaEnabled);
                    if (data.data.isCaptchaEnabled) {
                        const envRecaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
                        setRecaptchaKey(envRecaptchaKey || data.data.captchaKey);
                    } else {
                        setRecaptchaKey("off_captcha");
                    }
                } else {
                    console.error('Failed to fetch captcha status');
                }
            } catch (error) {
                console.error('Error fetching captcha status:', error);
            }
        };

        fetchCaptchaStatus();

        // Ustawienie interwału do okresowego sprawdzania stanu Captcha
        const intervalId = setInterval(() => {
            fetchCaptchaStatus();
        }, 60000); // Sprawdzaj co minutę

        // Cleanup - usunięcie interwału, gdy komponent zostanie odmontowany
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
    }, [isCaptchaEnabled, recaptchaKey]);

    return (
        <GoogleReCaptchaProvider reCaptchaKey={recaptchaKey}>
            {children}
        </GoogleReCaptchaProvider>
    );
}
