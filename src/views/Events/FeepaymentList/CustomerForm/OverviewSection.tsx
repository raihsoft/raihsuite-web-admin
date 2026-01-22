import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import type { FormSectionBaseProps } from './types'
import type { FeePaymentFormSchema } from './types'

type OverviewSectionProps = FormSectionBaseProps

const OverviewSection = ({ control, errors }: OverviewSectionProps) => {
    // Hardcoded payment type options
    const paymentOptions = [
        { label: 'Advance', value: 'Advance' },
        { label: 'Installment', value: 'Installment' },
    ]

    return (
        <Card>
            <div className="grid md:grid-cols-2 gap-4">

                {/* Participant Name */}
                <FormItem
                    label="Participant Name"
                    invalid={!!errors.participant_name}
                    errorMessage={errors.participant_name?.message}
                >
                    <Controller
                        name="participant_name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="text"
                                placeholder="Enter participant name"
                            />
                        )}
                    />
                </FormItem>

                {/* Fee Amount */}
                <FormItem
                    label="Fee Amount"
                    invalid={!!errors.fee_amount}
                    errorMessage={errors.fee_amount?.message}
                >
                    <Controller
                        name="fee_amount"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="text"
                                placeholder="Enter fee amount"
                            />
                        )}
                    />
                </FormItem>

                {/* Payment Type */}
                <FormItem
                    label="Payment Type"
                    invalid={!!errors.payment_type}
                    errorMessage={errors.payment_type?.message}
                >
                    <Controller
                        name="payment_type"
                        control={control}
                        render={({ field }) => {
                            // Find selected option object for Select
                            const selectedOption = paymentOptions.find(
                                (opt) => opt.value === field.value
                            ) || null

                            return (
                                <Select
                                    options={paymentOptions}
                                    value={selectedOption}           // Selected object
                                    onChange={(option) =>
                                        field.onChange(option?.value) // Only send string to form
                                    }
                                    placeholder="Select payment type"
                                    isClearable={false}
                                />
                            )
                        }}
                    />
                </FormItem>

            </div>
        </Card>
    )
}

export default OverviewSection
