import { Show } from "solid-js"
import { Navigate } from "@solidjs/router"
import { useAuth } from "./context/AuthContext"

const AdminRoute = (props) => {
    const { isAuthenticated, loading, isAdmin}= useAuth()
    return (
        <Show when={!loading()} fallback={<div>Loading...</div>}>
            <Show when={isAuthenticated()} fallback={<Navigate href="/login" replace={true} />}>
                <Show when={isAdmin()} fallback={<Navigate href="/" replace={true} />}>
                    {props.children}
                </Show>
            </Show>
        </Show>
    )
}

export default AdminRoute