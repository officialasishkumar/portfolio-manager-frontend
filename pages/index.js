import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            router.push("/orders");
        } else {
            router.push("/login");
        }
    }, [router]);

    return null;
}
