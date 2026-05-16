import DebouceInput from '@/components/shared/DebouceInput'
import { TbSearch } from 'react-icons/tb'
import { Ref } from 'react'

type Props = {
    onInputChange: (value: string) => void
    inputRef?: Ref<HTMLInputElement>
}

const CustomerListSearch = ({ onInputChange, inputRef }: Props) => {
    return (
        <DebouceInput
            ref={inputRef}
            placeholder="Quick search..."
            suffix={<TbSearch className="text-lg" />}
            onChange={(e) => {
                console.log('🔎 SEARCH:', e.target.value)   // DEBUG
                onInputChange(e.target.value)
            }}
        />
    )
}

export default CustomerListSearch