/* @refresh reload */
import { render } from 'solid-js/web'
import './index.css'
import { Router, Route } from '@solidjs/router'
import { lazy } from 'solid-js'
import { Suspense } from 'solid-js'
import PrivateRoute from './routes/PrivateRoute'
import AdminRoute from './routes/AdminRoute'

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

const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Dashboard = lazy(() => import('./pages/Dashboard'))

const AuthProvider = lazy(() => import('./contexts/AuthContext').then(module => ({ default: module.AuthProvider })))

render(() =>
    <Suspense fallback={<div>Loading...</div>}>
        <AuthProvider>
            <Router>
                <Route path="/" component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Route path="/dashboard" element={
                    <AdminRoute>
                        <Dashboard />
                    </AdminRoute>
                } />
                <Route path="/pdfs" element={
                    <PrivateRoute>
                        <PDFs />
                    </PrivateRoute>
                } />
            </Router>
        </AuthProvider>
    </Suspense>
    , root)
