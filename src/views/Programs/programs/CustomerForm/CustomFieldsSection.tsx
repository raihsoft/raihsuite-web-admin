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
}

const FIELD_TYPE_OPTIONS = [
    { label: 'Text Input', value: 'text' },
    { label: 'Dropdown Select', value: 'select' },
]

export const CustomFieldsSection = ({
    fields,
    onChange,
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

    const handleFieldChange = (index: number, key: keyof ParticipantCustomField, value: any) => {
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

    const handleOptionChange = (
        fieldIndex: number,
        optionIndex: number,
        key: keyof ParticipantCustomFieldOption,
        value: any
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
        <Card className="border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        Participant Custom Fields
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Configure additional fields to collect from participants when registering under this program.
                    </p>
                </div>
                <Button
                    type="button"
                    size="sm"
                    variant="solid"
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
                                type="button"
                                className="absolute top-4 right-4 p-1 text-gray-400 hover:text-red-500 transition-colors"
                                onClick={() => handleRemoveField(fieldIdx)}
                                title="Remove Field"
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
                                        placeholder="e.g. course"
                                        value={field.field_key}
                                        onChange={(e) =>
                                            handleFieldChange(fieldIdx, 'field_key', e.target.value)
                                        }
                                        disabled={!!field.id} // Keys are frozen once created
                                    />
                                </FormItem>

                                {/* Field Type */}
                                <FormItem label="Field Type">
                                    <Select
                                        options={FIELD_TYPE_OPTIONS}
                                        value={FIELD_TYPE_OPTIONS.find(opt => opt.value === field.field_type)}
                                        onChange={(opt) =>
                                            handleFieldChange(fieldIdx, 'field_type', opt?.value || 'text')
                                        }
                                        isClearable={false}
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

                            {/* Dropdown Options section if field type is select */}
                            {field.field_type === 'select' && (
                                <div className="mt-6 border-t border-gray-200 dark:border-gray-800 pt-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Dropdown Options
                                        </h5>
                                        <Button
                                            type="button"
                                            size="xs"
                                            variant="plain"
                                            icon={<TbPlus />}
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
                                                            size="sm"
                                                            placeholder="Option Display Label (e.g. BA English)"
                                                            value={opt.label}
                                                            onChange={(e) =>
                                                                handleOptionChange(fieldIdx, optIdx, 'label', e.target.value)
                                                            }
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <Input
                                                            size="sm"
                                                            placeholder="Option Value (e.g. ba_english)"
                                                            value={opt.value}
                                                            onChange={(e) =>
                                                                handleOptionChange(fieldIdx, optIdx, 'value', e.target.value)
                                                            }
                                                            disabled={!!opt.id}
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
