import { Card, Progress, Badge, Avatar } from '@/components/ui'
import { FiUsers, FiShoppingCart, FiTrendingUp, FiPackage, FiActivity, FiDollarSign, FiEye, FiClock, FiArrowUp, FiArrowDown, FiMoreVertical, FiTarget, FiZap, FiShield, FiAward, FiTrendingDown, FiBarChart2, FiPieChart, FiDatabase, FiServer, FiWifi, FiCpu, FiGrid, FiCalendar, FiFileText, FiSettings, FiBell, FiMail, FiMessageSquare, FiAlertTriangle, FiCheckCircle, FiXCircle, FiRefreshCw, FiDownload, FiUpload, FiFilter, FiSearch, FiEdit, FiTrash2, FiPlus, FiMinus, FiExternalLink } from 'react-icons/fi'
import { HiOutlineSparkles, HiOutlineChartBar, HiOutlineUserGroup, HiOutlineShoppingBag, HiOutlineLightBulb } from 'react-icons/hi'
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'

const Dashboard = () => {
    const recentActivities = [
        { id: 1, user: 'John Doe', action: 'completed order #1234', time: '2 hours ago', avatar: 'JD', color: 'bg-gradient-to-r from-indigo-500 to-purple-600', status: 'success' },
        { id: 2, user: 'Sarah Smith', action: 'registered new account', time: '3 hours ago', avatar: 'SS', color: 'bg-gradient-to-r from-emerald-500 to-teal-600', status: 'info' },
        { id: 3, user: 'Mike Johnson', action: 'updated product catalog', time: '5 hours ago', avatar: 'MJ', color: 'bg-gradient-to-r from-rose-500 to-pink-600', status: 'warning' },
        { id: 4, user: 'Emma Wilson', action: 'made payment $250', time: '6 hours ago', avatar: 'EW', color: 'bg-gradient-to-r from-amber-500 to-orange-600', status: 'success' },
    ]

    const quickStats = [
        { title: 'Daily Revenue', value: 12450, change: '+12.5%', trend: 'up', icon: FiDollarSign, color: 'from-violet-400 to-indigo-600', bgColor: 'bg-violet-50 dark:bg-violet-900/20' },
        { title: 'Active Users', value: 892, change: '+8.2%', trend: 'up', icon: FiUsers, color: 'from-cyan-400 to-blue-600', bgColor: 'bg-cyan-50 dark:bg-cyan-900/20' },
        { title: 'Conversion Rate', value: 3.24, change: '+2.1%', trend: 'up', icon: FiTrendingUp, color: 'from-emerald-400 to-green-600', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20' },
        { title: 'Avg. Order Value', value: 156, change: '-1.3%', trend: 'down', icon: FiShoppingCart, color: 'from-rose-400 to-pink-600', bgColor: 'bg-rose-50 dark:bg-rose-900/20' },
    ]

    const performanceMetrics = [
        { title: 'Sales Target', value: 75, color: 'bg-gradient-to-r from-violet-500 to-indigo-600', description: '$75,000 of $100,000 goal', icon: HiOutlineChartBar },
        { title: 'Customer Satisfaction', value: 92, color: 'bg-gradient-to-r from-emerald-500 to-teal-600', description: '4.6/5.0 average rating', icon: HiOutlineUserGroup },
        { title: 'Inventory Status', value: 60, color: 'bg-gradient-to-r from-amber-500 to-orange-600', description: '534 of 890 items in stock', icon: HiOutlineShoppingBag },
        { title: 'Website Traffic', value: 88, color: 'bg-gradient-to-r from-rose-500 to-pink-600', description: '8,800 of 10,000 daily visits', icon: FiEye },
    ]

    const teamPerformance = [
        { name: 'Sales Team', performance: 85, members: 12, target: '$50,000', achieved: '$42,500', color: 'from-violet-400 to-indigo-600' },
        { name: 'Marketing Team', performance: 92, members: 8, target: '1000 leads', achieved: '920 leads', color: 'from-emerald-400 to-teal-600' },
        { name: 'Support Team', performance: 78, members: 15, target: '500 tickets', achieved: '390 tickets', color: 'from-rose-400 to-pink-600' },
        { name: 'Development Team', performance: 88, members: 10, target: '20 features', achieved: '18 features', color: 'from-amber-400 to-orange-600' },
    ]

    const systemHealth = [
        { metric: 'Server Uptime', value: '99.9%', status: 'healthy', icon: FiServer, color: 'text-emerald-500' },
        { metric: 'Database Performance', value: 'Optimal', status: 'healthy', icon: FiDatabase, color: 'text-emerald-500' },
        { metric: 'API Response Time', value: '120ms', status: 'good', icon: FiZap, color: 'text-blue-500' },
        { metric: 'Network Status', value: 'Stable', status: 'healthy', icon: FiWifi, color: 'text-emerald-500' },
        { metric: 'CPU Usage', value: '45%', status: 'normal', icon: FiCpu, color: 'text-amber-500' },
    ]

    const erpQuotes = [
        { quote: "Raihsuite ERP transforms complexity into simplicity, empowering businesses to reach their full potential.", author: "Raihsuite Vision" },
        { quote: "With Raihsuite, every process becomes an opportunity for growth and efficiency.", author: "Business Excellence" },
        { quote: "Innovation meets reliability - that's the promise of Raihsuite ERP.", author: "Technology Leadership" },
    ]

    const companyMetrics = [
        { title: 'Total Employees', value: '156', change: '+5', icon: FiUsers, color: 'from-violet-400 to-indigo-600' },
        { title: 'Departments', value: '8', change: '0', icon: FiAward, color: 'from-emerald-400 to-teal-600' },
        { title: 'Projects Active', value: '23', change: '+3', icon: FiTarget, color: 'from-rose-400 to-pink-600' },
        { title: 'Efficiency Rate', value: '94%', change: '+2%', icon: FiZap, color: 'from-amber-400 to-orange-600' },
    ]

    const salesChart = [
        { month: 'Jan', sales: 45000, target: 50000 },
        { month: 'Feb', sales: 52000, target: 50000 },
        { month: 'Mar', sales: 48000, target: 55000 },
        { month: 'Apr', sales: 61000, target: 60000 },
        { month: 'May', sales: 58000, target: 65000 },
        { month: 'Jun', sales: 67000, target: 70000 },
    ]

    const notifications = [
        { id: 1, type: 'alert', title: 'Server Maintenance', message: 'Scheduled maintenance tonight at 2 AM', time: '1 hour ago', icon: FiAlertTriangle, color: 'text-amber-500' },
        { id: 2, type: 'success', title: 'Target Achieved', message: 'Sales team exceeded monthly target', time: '3 hours ago', icon: FiCheckCircle, color: 'text-emerald-500' },
        { id: 3, type: 'info', title: 'New Feature', message: 'Advanced analytics now available', time: '5 hours ago', icon: FiBell, color: 'text-blue-500' },
        { id: 4, type: 'error', title: 'Payment Failed', message: 'Transaction #5678 could not be processed', time: '6 hours ago', icon: FiXCircle, color: 'text-rose-500' },
    ]

    const recentProjects = [
        { id: 1, name: 'Website Redesign', status: 'In Progress', progress: 75, deadline: '2024-02-15', team: 'Development', priority: 'High' },
        { id: 2, name: 'Mobile App Launch', status: 'Planning', progress: 25, deadline: '2024-03-01', team: 'Mobile', priority: 'Medium' },
        { id: 3, name: 'Database Migration', status: 'Completed', progress: 100, deadline: '2024-01-30', team: 'Infrastructure', priority: 'High' },
        { id: 4, name: 'Marketing Campaign', status: 'In Progress', progress: 60, deadline: '2024-02-20', team: 'Marketing', priority: 'Low' },
    ]

    const upcomingTasks = [
        { id: 1, title: 'Review Q1 Reports', due: 'Today', priority: 'High', assignee: 'John Doe' },
        { id: 2, title: 'Team Meeting', due: 'Tomorrow', priority: 'Medium', assignee: 'Sarah Smith' },
        { id: 3, title: 'Client Presentation', due: 'In 3 days', priority: 'High', assignee: 'Mike Johnson' },
        { id: 4, title: 'Budget Planning', due: 'Next Week', priority: 'Low', assignee: 'Emma Wilson' },
    ]

    const revenueBreakdown = [
        { category: 'Product Sales', value: 45000, percentage: 60, color: 'from-violet-400 to-indigo-600' },
        { category: 'Services', value: 20000, percentage: 27, color: 'from-emerald-400 to-teal-600' },
        { category: 'Subscriptions', value: 7500, percentage: 10, color: 'from-amber-400 to-orange-600' },
        { category: 'Other', value: 2500, percentage: 3, color: 'from-rose-400 to-pink-600' },
    ]

    const ModernStatCard = ({ title, value, icon: Icon, color, badge, subtitle, trend }: any) => (
        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-r ${color} shadow-lg`}>
                        <Icon className="text-white text-xl" />
                    </div>
                    <div className="flex items-center space-x-2">
                        {badge && (
                            <Badge className={`bg-gradient-to-r ${trend === 'up' ? 'from-emerald-100 to-teal-200 text-emerald-800' : 'from-rose-100 to-pink-200 text-rose-800'} border-0 shadow-sm`}>
                                <div className="flex items-center space-x-1">
                                    {trend === 'up' ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />}
                                    <span>{badge}</span>
                                </div>
                            </Badge>
                        )}
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <FiMoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">{value}</p>
                    {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>}
                </div>
            </div>
        </Card>
    )

    const QuickStatCard = ({ stat }: any) => (
        <Card className="group border-0 bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300">
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-xl bg-gradient-to-r ${stat.color} shadow-sm`}>
                            <stat.icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                {stat.title.includes('Revenue') || stat.title.includes('Value') ? '$' : ''}{stat.value}
                                {stat.title.includes('Rate') || stat.title.includes('Efficiency') ? '%' : ''}
                            </p>
                        </div>
                    </div>
                    <div className={`flex items-center space-x-1 text-xs font-medium ${
                        stat.trend === 'up' || stat.change?.includes('+') ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                        {(stat.trend === 'up' || stat.change?.includes('+')) ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />}
                        <span>{stat.change}</span>
                    </div>
                </div>
            </div>
        </Card>
    )

    const QuoteCard = ({ quote, author }: any) => (
        <Card className="border-0 bg-gradient-to-r from-violet-500/10 via-indigo-500/10 to-purple-600/10 dark:from-violet-500/20 dark:via-indigo-500/20 dark:to-purple-600/20 backdrop-blur-sm shadow-lg">
            <div className="p-6">
                <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full shadow-lg">
                        <HiOutlineLightBulb className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <p className="text-lg font-medium text-gray-900 dark:text-white mb-3 italic">"{quote}"</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">— {author}</p>
                    </div>
                </div>
            </div>
        </Card>
    )

    const TeamCard = ({ team }: any) => (
        <Card className="border-0 bg-gradient-to-br from-white/70 to-gray-50/70 dark:from-gray-800/70 dark:to-gray-900/70 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300">
            <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{team.name}</h4>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        team.performance >= 90 ? 'bg-emerald-100 text-emerald-800' :
                        team.performance >= 75 ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                    }`}>
                        {team.performance}%
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Target</span>
                        <span className="font-medium text-gray-900 dark:text-white">{team.target}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Achieved</span>
                        <span className="font-medium text-gray-900 dark:text-white">{team.achieved}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Members</span>
                        <span className="font-medium text-gray-900 dark:text-white">{team.members}</span>
                    </div>
                    <Progress percent={team.performance} className="h-2 mt-2" />
                </div>
            </div>
        </Card>
    )

    const SystemHealthCard = ({ metric }: any) => (
        <div className="flex items-center justify-between p-3 bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
                <span className="text-sm font-medium text-gray-900 dark:text-white">{metric.metric}</span>
            </div>
            <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{metric.value}</span>
                <div className={`w-2 h-2 rounded-full ${
                    metric.status === 'healthy' ? 'bg-emerald-500' :
                    metric.status === 'good' ? 'bg-blue-500' :
                    metric.status === 'normal' ? 'bg-amber-500' :
                    'bg-red-500'
                }`}></div>
            </div>
        </div>
    )

    const NotificationCard = ({ notification }: any) => (
        <div className="flex items-start space-x-3 p-3 bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
            <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700`}>
                <notification.icon className={`w-4 h-4 ${notification.color}`} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">{notification.message}</p>
            </div>
        </div>
    )

    const ProjectCard = ({ project }: any) => (
        <Card className="border-0 bg-gradient-to-br from-white/70 to-gray-50/70 dark:from-gray-800/70 dark:to-gray-900/70 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300">
            <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{project.name}</h4>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.priority === 'High' ? 'bg-rose-100 text-rose-800' :
                        project.priority === 'Medium' ? 'bg-amber-100 text-amber-800' :
                        'bg-blue-100 text-blue-800'
                    }`}>
                        {project.priority}
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Status</span>
                        <span className={`font-medium ${
                            project.status === 'Completed' ? 'text-emerald-600' :
                            project.status === 'In Progress' ? 'text-blue-600' :
                            'text-amber-600'
                        }`}>{project.status}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Team</span>
                        <span className="font-medium text-gray-900 dark:text-white">{project.team}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Deadline</span>
                        <span className="font-medium text-gray-900 dark:text-white">{project.deadline}</span>
                    </div>
                    <Progress percent={project.progress} className="h-2 mt-2" />
                </div>
            </div>
        </Card>
    )

    const TaskCard = ({ task }: any) => (
        <div className="flex items-center justify-between p-3 bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
            <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                    task.priority === 'High' ? 'bg-rose-500' :
                    task.priority === 'Medium' ? 'bg-amber-500' :
                    'bg-blue-500'
                }`}></div>
                <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{task.title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Assigned to {task.assignee}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-xs font-medium text-gray-900 dark:text-white">{task.due}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{task.priority}</p>
            </div>
        </div>
    )

    const RevenueChart = ({ data }: { data: any[] }) => (
        <div className="space-y-4">
            {data.map((item: any, index: number) => (
                <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{item.category}</span>
                        <span className="font-medium text-gray-900 dark:text-white">${item.value.toLocaleString()}</span>
                    </div>
                    <div className="relative">
                        <Progress percent={item.percentage} className="h-3" />
                        <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-20 rounded-full`}></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.percentage}% of total revenue</p>
                </div>
            ))}
        </div>
    )

    return (
        <Container>
            <AdaptiveCard>
                <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900/20 p-6">
                    {/* Modern Header */}
                    <div className="mb-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-xl shadow-lg">
                                        <FiSettings className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
                                            Raihsuite Dashboard
                                        </h1>
                                        <p className="text-gray-600 dark:text-gray-400">Advanced ERP analytics & business intelligence</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Badge className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white border-0 shadow-lg">
                                    <HiOutlineSparkles className="w-4 h-4 mr-2" />
                                    Live Data
                                </Badge>
                                <button className="px-4 py-2 bg-gradient-to-r from-violet-500 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                                    <span className="text-sm font-medium">Export Report</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ERP Quote Section */}
                    <div className="mb-8">
                        <QuoteCard quote={erpQuotes[0].quote} author={erpQuotes[0].author} />
                    </div>

                    {/* Main Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <ModernStatCard
                            title="Total Users"
                            value="1,128"
                            icon={FiUsers}
                            color="from-blue-400 to-blue-600"
                            badge="12%"
                            subtitle="From 1,008 last month"
                            trend="up"
                        />
                        <ModernStatCard
                            title="Total Orders"
                            value="456"
                            icon={FiShoppingCart}
                            color="from-green-400 to-green-600"
                            badge="8%"
                            subtitle="From 422 last month"
                            trend="up"
                        />
                        <ModernStatCard
                            title="Revenue"
                            value="$89,750"
                            icon={FiDollarSign}
                            color="from-purple-400 to-purple-600"
                            badge="23%"
                            subtitle="From $73,000 last month"
                            trend="up"
                        />
                        <ModernStatCard
                            title="Products"
                            value="89"
                            icon={FiPackage}
                            color="from-orange-400 to-orange-600"
                            badge="5%"
                            subtitle="From 85 last month"
                            trend="up"
                        />
                    </div>

                    {/* Company Metrics & Quick Stats */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                                <FiAward className="w-5 h-5 text-blue-500" />
                                <span>Company Overview</span>
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {companyMetrics.map((metric, index) => (
                                    <QuickStatCard key={index} stat={metric} />
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                                <FiTrendingUp className="w-5 h-5 text-green-500" />
                                <span>Performance Indicators</span>
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {quickStats.map((stat, index) => (
                                    <QuickStatCard key={index} stat={stat} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Recent Activity */}
                        <Card 
                            header={{
                                content: (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-lg">
                                                <FiActivity className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</span>
                                        </div>
                                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                            <FiMoreVertical className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </div>
                                )
                            }}
                            className="border-0 bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-xl shadow-lg"
                        >
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {recentActivities.map((activity, index) => (
                                    <div key={activity.id} className={`flex items-start space-x-3 pb-4 ${index < recentActivities.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}>
                                        <Avatar className={`${activity.color} text-white flex-shrink-0 shadow-lg`} size="sm">
                                            {activity.avatar}
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-900 dark:text-white">
                                                <span className="font-medium">{activity.user}</span> {activity.action}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                                                <FiClock className="w-3 h-3 mr-1" />
                                                {activity.time}
                                            </p>
                                        </div>
                                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            activity.status === 'success' ? 'bg-green-100 text-green-800' :
                                            activity.status === 'warning' ? 'bg-amber-100 text-amber-800' :
                                            'bg-blue-100 text-blue-800'
                                        }`}>
                                            {activity.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Performance Metrics */}
                        <Card 
                            header={{
                                content: (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
                                                <FiEye className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="text-lg font-semibold text-gray-900 dark:text-white">Performance Metrics</span>
                                        </div>
                                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                            <FiMoreVertical className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </div>
                                )
                            }}
                            className="border-0 bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-xl shadow-lg"
                        >
                            <div className="space-y-6 max-h-96 overflow-y-auto">
                                {performanceMetrics.map((metric, index) => (
                                    <div key={index} className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                                    <metric.icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{metric.title}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{metric.description}</p>
                                                </div>
                                            </div>
                                            <span className="text-lg font-bold text-gray-900 dark:text-white">{metric.value}%</span>
                                        </div>
                                        <div className="relative">
                                            <Progress percent={metric.value} className="h-3" />
                                            <div className={`absolute inset-0 ${metric.color} opacity-20 rounded-full`}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Team Performance */}
                        <Card 
                            header={{
                                content: (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-gradient-to-r from-rose-500 to-pink-600 rounded-lg">
                                                <FiUsers className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="text-lg font-semibold text-gray-900 dark:text-white">Team Performance</span>
                                        </div>
                                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                            <FiMoreVertical className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </div>
                                )
                            }}
                            className="border-0 bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-xl shadow-lg"
                        >
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {teamPerformance.map((team, index) => (
                                    <TeamCard key={index} team={team} />
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Additional Features Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                        {/* Notifications */}
                        <Card 
                            header={{
                                content: (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg">
                                                <FiBell className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</span>
                                        </div>
                                        <Badge className="bg-rose-100 text-rose-800 border-0">4</Badge>
                                    </div>
                                )
                            }}
                            className="border-0 bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-xl shadow-lg lg:col-span-1"
                        >
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {notifications.map((notification, index) => (
                                    <NotificationCard key={index} notification={notification} />
                                ))}
                            </div>
                        </Card>

                        {/* Recent Projects */}
                        <Card 
                            header={{
                                content: (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg">
                                                <FiTarget className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="text-lg font-semibold text-gray-900 dark:text-white">Recent Projects</span>
                                        </div>
                                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                            <FiPlus className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </div>
                                )
                            }}
                            className="border-0 bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-xl shadow-lg lg:col-span-2"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                                {recentProjects.map((project, index) => (
                                    <ProjectCard key={index} project={project} />
                                ))}
                            </div>
                        </Card>

                        {/* Upcoming Tasks */}
                        <Card 
                            header={{
                                content: (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                                                <FiCalendar className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="text-lg font-semibold text-gray-900 dark:text-white">Tasks</span>
                                        </div>
                                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                            <FiPlus className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </div>
                                )
                            }}
                            className="border-0 bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-xl shadow-lg lg:col-span-1"
                        >
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {upcomingTasks.map((task, index) => (
                                    <TaskCard key={index} task={task} />
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Revenue Breakdown & Sales Chart */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Revenue Breakdown */}
                        <Card 
                            header={{
                                content: (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
                                                <FiPieChart className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Breakdown</span>
                                        </div>
                                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                            <FiDownload className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </div>
                                )
                            }}
                            className="border-0 bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-xl shadow-lg"
                        >
                            <div className="space-y-4">
                                <RevenueChart data={revenueBreakdown} />
                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</span>
                                        <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">$75,000</span>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Sales Performance Chart */}
                        <Card 
                            header={{
                                content: (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-lg">
                                                <FiBarChart2 className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="text-lg font-semibold text-gray-900 dark:text-white">Sales Performance</span>
                                        </div>
                                        <select className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                                            <option>Last 6 Months</option>
                                            <option>Last Year</option>
                                            <option>All Time</option>
                                        </select>
                                    </div>
                                )
                            }}
                            className="border-0 bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-xl shadow-lg"
                        >
                            <div className="space-y-4">
                                {salesChart.map((item, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">{item.month}</span>
                                            <div className="text-right">
                                                <span className="font-medium text-gray-900 dark:text-white">${item.sales.toLocaleString()}</span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">/ ${item.target.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <Progress percent={(item.sales / item.target) * 100} className="h-3" />
                                            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-indigo-500/20 rounded-full"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* System Health & Additional Quote */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* System Health */}
                        <Card 
                            header={{
                                content: (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
                                                <FiShield className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="text-lg font-semibold text-gray-900 dark:text-white">System Health</span>
                                        </div>
                                        <Badge className="bg-emerald-100 text-emerald-800 border-0">
                                            All Systems Operational
                                        </Badge>
                                    </div>
                                )
                            }}
                            className="border-0 bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-xl shadow-lg"
                        >
                            <div className="space-y-3">
                                {systemHealth.map((metric, index) => (
                                    <SystemHealthCard key={index} metric={metric} />
                                ))}
                            </div>
                        </Card>

                        {/* ERP Quote */}
                        <Card 
                            header={{
                                content: (
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg">
                                            <HiOutlineSparkles className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="text-lg font-semibold text-gray-900 dark:text-white">Raihsuite Inspiration</span>
                                    </div>
                                )
                            }}
                            className="border-0 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-600/10 dark:from-amber-500/20 dark:via-orange-500/20 dark:to-rose-600/20 backdrop-blur-sm shadow-lg"
                        >
                            <div className="p-6">
                                <QuoteCard quote={erpQuotes[1].quote} author={erpQuotes[1].author} />
                            </div>
                        </Card>
                    </div>
                </div>
            </AdaptiveCard>
        </Container>
    )
}

export default Dashboard
