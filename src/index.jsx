/* @refresh reload */
import { render } from 'solid-js/web'
import './index.css'
import { Router } from '@solidjs/router'
import { lazy } from 'solid-js'

const root = document.getElementById('root')

if (!root) throw new Error('Failed to find the root element')

/* Cuando tengamos un header y un footer descomentar este Layout y añadir prop root = {Layout} en el Router
    const Layout = (props) => {
        return (
            <>
                <header>Header</header>
                {props.children}
                <footer>Footer</footer>
            </>
        )
    }
*/

const routes = [
    {
        path: "/",
        component: lazy(() => import("/pages/"))
    }
]

render(() => <Router>{routes}</Router>
    , root)
