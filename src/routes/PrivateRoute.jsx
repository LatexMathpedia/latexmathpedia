import { Show } from "solid-js"
import { Navigate } from "@solidjs/router"
import { useAuth } from "../contexts/AuthContext"

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