import { Show } from "solid-js"
import { Navigate } from "@solidjs/router"
import { useAuth } from "./context/AuthContext"

const PrivateRoute = (props) => {
    const { isAuthenticated, loading}= useAuth()
    return (
        <Show when={!loading()} fallback={<div>Loading...</div>}>
            <Show when={isAuthenticated()} fallback={<Navigate href="/login" replace={true} />}>
                {props.children}
            </Show>
        </Show>
    )
}

export default PrivateRoute