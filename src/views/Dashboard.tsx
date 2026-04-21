import Chart from '@/components/shared/Chart'
import type { ApexOptions } from 'apexcharts'

const Dashboard = () => {
    const lineSeries = [
        {
            name: 'Visitors',
            data: [10, 41, 35, 51, 49, 62, 69, 91, 125],
        },
    ]

    const xAxis = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']

    const donutSeries = [44, 55, 13, 43]
    const donutLabels = ['Direct', 'Referral', 'Social', 'Other']

    const donutOptions: ApexOptions = {
        labels: donutLabels,
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white dark:bg-slate-800 rounded shadow">
                    <h3 className="text-lg font-medium mb-2">Traffic</h3>
                    <Chart type="area" series={lineSeries} xAxis={xAxis} height={320} />
                </div>

                <div className="p-4 bg-white dark:bg-slate-800 rounded shadow">
                    <h3 className="text-lg font-medium mb-2">Traffic Sources</h3>
                    <Chart type="donut" series={donutSeries} customOptions={donutOptions} height={320} />
                </div>
            </div>
        </div>
    )
}

export default Dashboard
