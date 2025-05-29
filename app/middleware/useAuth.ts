import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export const useAuth = () => {
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            console.log("Redirecting to login");
            router.push("/");
        }
    }, [router]);

    return;
};
