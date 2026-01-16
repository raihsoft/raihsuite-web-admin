import { Button } from "@/components/ui"
import useAuth from '@/auth/useAuth'
import Dashboard from './Dashboard'

const Home = () => {
    const { authenticated } = useAuth()

    return (
        <div>
            {authenticated ? (
                <Dashboard />
            ) : (
                <div className="p-6 bg-white dark:bg-slate-800 rounded shadow">
                    <h2 className="text-xl font-semibold mb-2">Welcome</h2>
                    <p className="mb-4">Please sign in to see your dashboard and charts.</p>
                    <Button variant="solid" onClick={() => (window.location.href = '/sign-in')}>Sign in</Button>
                </div>
            )}
        </div>
    )
}

export default Home
