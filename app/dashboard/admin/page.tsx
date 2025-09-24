"use client"

import { useProtectedRoute } from "@/hooks/use-protected-route";

function Admin () {
    const { isAuthenticated, loading } = useProtectedRoute();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // El hook maneja la redirección
    }

    return <div>Admin Dashboard</div>
}

export default Admin;