import { Controller } from 'react-hook-form'

import Card from '@/components/ui/Card'

import Input from '@/components/ui/Input'

import DatePicker from '@/components/ui/DatePicker/DatePicker'

import { FormItem } from '@/components/ui/Form'

// =========================
// COMPONENT
// =========================
const OverviewSection = ({
    control,
    errors,
}: any) => {
    return (
        <Card>
            {/* NAME */}
            <FormItem
                label="Name"
                errorMessage={
                    errors.name?.message
                }
            >
                <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            placeholder="Enter program name"
                        />
                    )}
                />
            </FormItem>

            {/* CODE */}
            <FormItem
                label="Code"
                errorMessage={
                    errors.code?.message
                }
            >
                <Controller
                    name="code"
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            placeholder="Enter code"
                        />
                    )}
                />
            </FormItem>

            {/* DESCRIPTION */}
            <FormItem
                label="Description"
                errorMessage={
                    errors.description
                        ?.message
                }
            >
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            placeholder="Enter description"
                        />
                    )}
                />
            </FormItem>

            {/* START DATE */}
            <FormItem
                label="Start Date"
                errorMessage={
                    errors.start_date
                        ?.message
                }
            >
                <Controller
                    name="start_date"
                    control={control}
                    render={({ field }) => (
                        <DatePicker
                            value={
                                field.value
                                    ? new Date(
                                          field.value,
                                      )
                                    : null
                            }
                            onChange={(
                                d: any,
                            ) =>
                                field.onChange(
                                    d
                                        ? d.toISOString()
                                        : '',
                                )
                            }
                            inputFormat="YYYY-MM-DD"
                            type="date"
                        />
                    )}
                />
            </FormItem>

            {/* END DATE */}
            <FormItem
                label="End Date"
                errorMessage={
                    errors.end_date
                        ?.message
                }
            >
                <Controller
                    name="end_date"
                    control={control}
                    render={({ field }) => (
                        <DatePicker
                            value={
                                field.value
                                    ? new Date(
                                          field.value,
                                      )
                                    : null
                            }
                            onChange={(
                                d: any,
                            ) =>
                                field.onChange(
                                    d
                                        ? d.toISOString()
                                        : '',
                                )
                            }
                            inputFormat="YYYY-MM-DD"
                            type="date"
                        />
                    )}
                />
            </FormItem>
        </Card>
    )
}

export default OverviewSection