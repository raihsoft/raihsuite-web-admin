import CustomerTableFilter from './CustomerListTableFilter'

const CustomersListTableTools = ({ eventId }: { eventId?: string }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-2">
            <CustomerTableFilter eventId={eventId} />
        </div>
    )
}

export default CustomersListTableTools
