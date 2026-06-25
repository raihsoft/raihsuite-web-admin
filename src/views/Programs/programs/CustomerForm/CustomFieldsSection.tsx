import { ParticipantCustomField, ParticipantCustomFieldOption } from './types'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Switcher from '@/components/ui/Switcher'
import { FormItem } from '@/components/ui/Form'
import { TbPlus, TbTrash } from 'react-icons/tb'

type CustomFieldsSectionProps = {
    fields: ParticipantCustomField[]
    onChange: (fields: ParticipantCustomField[]) => void
    className?: string
}

const FIELD_TYPE_OPTIONS = [
    { label: 'Text Input', value: 'text' },
    { label: 'Number Input', value: 'number' },
    { label: 'Email Input', value: 'email' },
    { label: 'Phone Input', value: 'phone' },
    { label: 'Date Input', value: 'date' },
    { label: 'Dropdown Select', value: 'select' },
    { label: 'Checkbox', value: 'checkbox' },
    { label: 'Textarea', value: 'textarea' },
]

export const CustomFieldsSection = ({
    fields,
    onChange,
    className,
}: CustomFieldsSectionProps) => {

    const handleAddField = () => {
        const newField: ParticipantCustomField = {
            label: '',
            field_key: '',
            field_type: 'text',
            is_required: false,
            placeholder: '',
            order: fields.length + 1,
            is_active: true,
            options: [],
        }
        onChange([...fields, newField])
    }

    const handleRemoveField = (index: number) => {
        const updated = fields.filter((_, i) => i !== index)
        // Recalculate order
        const reordered = updated.map((field, idx) => ({
            ...field,
            order: idx + 1,
        }))
        onChange(reordered)
    }

    const handleFieldChange = <K extends keyof ParticipantCustomField>(
        index: number,
        key: K,
        value: ParticipantCustomField[K]
    ) => {
        const updated = [...fields]
        updated[index] = {
            ...updated[index],
            [key]: value,
        }

        // Auto-generate key from label if they update label
        if (key === 'label' && !updated[index].id) {
            const labelVal = value as string
            updated[index].field_key = labelVal
                .toLowerCase()
                .replace(/[^a-z0-9_]+/g, '_')
                .replace(/^_+|_+$/g, '')
        }

        onChange(updated)
    }

    const handleAddOption = (fieldIndex: number) => {
        const updated = [...fields]
        const currentOptions = updated[fieldIndex].options || []
        const newOption: ParticipantCustomFieldOption = {
            label: '',
            value: '',
            order: currentOptions.length + 1,
            is_active: true,
        }
        updated[fieldIndex].options = [...currentOptions, newOption]
        onChange(updated)
    }

    const handleRemoveOption = (fieldIndex: number, optionIndex: number) => {
        const updated = [...fields]
        const currentOptions = updated[fieldIndex].options || []
        const filteredOptions = currentOptions.filter((_, i) => i !== optionIndex)
        // Recalculate option order
        updated[fieldIndex].options = filteredOptions.map((opt, idx) => ({
            ...opt,
            order: idx + 1,
        }))
        onChange(updated)
    }

    const handleOptionChange = <K extends keyof ParticipantCustomFieldOption>(
        fieldIndex: number,
        optionIndex: number,
        key: K,
        value: ParticipantCustomFieldOption[K]
    ) => {
        const updated = [...fields]
        const currentOptions = updated[fieldIndex].options ? [...(updated[fieldIndex].options as ParticipantCustomFieldOption[])] : []
        currentOptions[optionIndex] = {
            ...currentOptions[optionIndex],
            [key]: value,
        }

        // Auto-generate value from label for option
        if (key === 'label' && !currentOptions[optionIndex].id) {
            const labelVal = value as string
            currentOptions[optionIndex].value = labelVal
                .toLowerCase()
                .replace(/[^a-z0-9_]+/g, '_')
                .replace(/^_+|_+$/g, '')
        }

        updated[fieldIndex].options = currentOptions
        onChange(updated)
    }

    return (
        <Card className={className}>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        Participant Registration Fields
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Configure the dynamic custom fields that participants must fill out during registration.
                    </p>
                </div>
                <Button
                    icon={<TbPlus />}
                    onClick={handleAddField}
                >
                    Add Custom Field
                </Button>
            </div>

            {fields.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                    <div className="text-4xl mb-3">📋</div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        No custom fields configured for this program.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {fields.map((field, fieldIdx) => (
                        <div
                            key={fieldIdx}
                            className="p-6 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-900/30 relative group transition-all"
                        >
                            {/* Delete Button */}
                            <button
                                className="absolute top-4 right-4 p-1 text-gray-400 hover:text-red-500 transition-colors"
                                title="Remove Field"
                                type="button"
                                onClick={() => handleRemoveField(fieldIdx)}
                            >
                                <TbTrash className="text-lg" />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pr-6">
                                {/* Label */}
                                <FormItem label="Field Label">
                                    <Input
                                        placeholder="e.g. Course"
                                        value={field.label}
                                        onChange={(e) =>
                                            handleFieldChange(fieldIdx, 'label', e.target.value)
                                        }
                                    />
                                </FormItem>

                                {/* Key */}
                                <FormItem label="Field Key (Internal)">
                                    <Input
                                        disabled={!!field.id} // Keys are frozen once created
                                        placeholder="e.g. course"
                                        value={field.field_key}
                                        onChange={(e) =>
                                            handleFieldChange(fieldIdx, 'field_key', e.target.value)
                                        }
                                    />
                                </FormItem>

                                {/* Field Type */}
                                <FormItem label="Field Type">
                                    <Select
                                        isClearable={false}
                                        options={FIELD_TYPE_OPTIONS}
                                        value={FIELD_TYPE_OPTIONS.find(opt => opt.value === field.field_type)}
                                        onChange={(opt) =>
                                            handleFieldChange(
                                                fieldIdx,
                                                'field_type',
                                                (opt?.value || 'text') as ParticipantCustomField['field_type']
                                            )
                                        }
                                    />
                                </FormItem>

                                {/* Required Switcher */}
                                <FormItem label="Is Required?">
                                    <div className="flex items-center h-11">
                                        <Switcher
                                            checked={field.is_required}
                                            onChange={(checked) =>
                                                handleFieldChange(fieldIdx, 'is_required', checked)
                                            }
                                        />
                                    </div>
                                </FormItem>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                {/* Placeholder */}
                                <FormItem label="Placeholder Text">
                                    <Input
                                        placeholder="e.g. Select your course"
                                        value={field.placeholder || ''}
                                        onChange={(e) =>
                                            handleFieldChange(fieldIdx, 'placeholder', e.target.value)
                                        }
                                    />
                                </FormItem>
                            </div>

                            {/* Options section for select and checkbox */}
                            {['select', 'checkbox'].includes(field.field_type) && (
                                <div className="mt-6 border-t border-gray-200 dark:border-gray-800 pt-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            {field.field_type === 'select' ? 'Dropdown' : 'Checkbox'} Options
                                        </h5>
                                        <Button
                                            icon={<TbPlus />}
                                            size="xs"
                                            type="button"
                                            variant="plain"
                                            onClick={() => handleAddOption(fieldIdx)}
                                        >
                                            Add Option
                                        </Button>
                                    </div>

                                    {(field.options || []).length === 0 ? (
                                        <div className="text-center py-4 border border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
                                            <p className="text-xs text-gray-400">
                                                Please add at least one option.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {(field.options || []).map((opt, optIdx) => (
                                                <div key={optIdx} className="flex gap-4 items-center max-w-2xl">
                                                    <div className="flex-1">
                                                        <Input
                                                            placeholder="Option Display Label (e.g. Option A)"
                                                            size="sm"
                                                            value={opt.label}
                                                            onChange={(e) =>
                                                                handleOptionChange(fieldIdx, optIdx, 'label', e.target.value)
                                                            }
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <Input
                                                            disabled={!!opt.id}
                                                            placeholder="Option Value (e.g. option_a)"
                                                            size="sm"
                                                            value={opt.value}
                                                            onChange={(e) =>
                                                                handleOptionChange(fieldIdx, optIdx, 'value', e.target.value)
                                                            }
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                        onClick={() => handleRemoveOption(fieldIdx, optIdx)}
                                                    >
                                                        <TbTrash className="text-base" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </Card>
    )
}
