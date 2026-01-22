import DebouceInput from '@/components/shared/DebouceInput'
import { TbSearch } from 'react-icons/tb'
import { forwardRef } from 'react'

type CustomerListSearchProps = {
    onInputChange: (value: string) => void
}

const CustomerListSearch = forwardRef<
    HTMLInputElement,
    CustomerListSearchProps
>(({ onInputChange }, ref) => {
    return (
        <DebouceInput
            ref={ref}
            placeholder="Quick search..."
            suffix={<TbSearch className="text-lg" />}
            onChange={(e) => onInputChange(e.target.value)}
        />
    )
})

CustomerListSearch.displayName = 'CustomerListSearch'

export default CustomerListSearch
