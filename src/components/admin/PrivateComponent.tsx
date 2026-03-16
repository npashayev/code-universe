'use client';
import { UserRole } from "@/types/next-auth";
import { useSession } from "next-auth/react";
import { ReactNode } from "react";


interface Props {
    roles: UserRole[];
    children: ReactNode;
    fallback?: ReactNode;
}

const PrivateComponent = ({ roles, children, fallback = null }: Props) => {
    const { data: session } = useSession();

    const userRole = session?.user?.role;

    if (!userRole || !roles.includes(userRole)) return fallback;

    return children;
}
export default PrivateComponent;