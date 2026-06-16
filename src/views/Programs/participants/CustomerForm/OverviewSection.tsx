import { Controller } from 'react-hook-form'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import ReactSelect from 'react-select'

const OverviewSection = ({ control, errors, programOptions, newCustomer }: any) => {
    return (
        <Card>
          

            {/* PROGRAM */}
            {newCustomer && (
                <FormItem label="Program" errorMessage={errors.program?.message}>
                    <Controller
                         name="program"
                         control={control}
                         render={({ field }) => (
                             <ReactSelect
                                 options={programOptions || []}
                                 placeholder="Select Program"
                                 value={
                                     programOptions?.find(
                                         (o: any) => o.value === field.value
                                     ) || null
                                 }
                                 onChange={(opt) => field.onChange(opt?.value)}
                             />
                         )}
                    />
                </FormItem>
            )}

            <FormItem label="Name" errorMessage={errors.first_name?.message}>
                <Controller name="first_name" control={control}
                    render={({ field }) => <Input {...field} placeholder="Enter name" />}
                />
            </FormItem>

            <FormItem label="Email" errorMessage={errors.email?.message}>
                <Controller name="email" control={control}
                    render={({ field }) => <Input {...field} placeholder="Enter email" />}
                />
            </FormItem>

            <FormItem label="Phone" errorMessage={errors.phone?.message}>
                <Controller name="phone" control={control}
                    render={({ field }) => <Input {...field} placeholder="Enter phone number" />}
                />
            </FormItem>

            <FormItem label="Place" errorMessage={errors.place?.message}>
                <Controller name="place" control={control}
                    render={({ field }) => <Input {...field} placeholder="Enter place" />}
                />
            </FormItem>
        </Card>
    )
}

export default OverviewSection