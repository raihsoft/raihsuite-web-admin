import { useState } from 'react'
import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Loading from '@/components/shared/Loading'
import Pagination from '@/components/ui/Pagination'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Input from '@/components/ui/Input'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { TbArrowNarrowLeft, TbEye, TbPencil, TbCloudDownload, TbTrash } from 'react-icons/tb'
import { CSVLink } from 'react-csv'
import Tooltip from '@/components/ui/Tooltip'
import { useParams, useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import {
    apiGetProgramById,
    apiGetProgramparticipantList,
    apiCreateProgramparticipant,
    apiGetParticipantCustomFields,
    apiDeleteProgramparticipant,
} from '@/services/CustomersService'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Select from '@/components/ui/Select'
import Checkbox from '@/components/ui/Checkbox'
import isEmpty from 'lodash/isEmpty'
import type { Customer } from '../ProgramsList/types'
import type { ParticipantCustomField, ParticipantCustomFieldOption } from '../CustomerForm/types'

type CustomDataValue = string | number | boolean | string[]

type DetailCustomField = Omit<ParticipantCustomField, 'program'> & {
    program?: string | { id: string | number }
    program_id?: string | number
}

type ProgramParticipant = {
    id: string | number
    program: string | number
    program_id?: string | number
    first_name: string
    last_name: string
    participant_name?: string
    email: string
    phone: string
    place: string
    custom_data: Record<string, CustomDataValue>
    created_at?: string
}

type GetProgramParticipantsResponse = {
    results: ProgramParticipant[]
}

type CustomFieldsResponse = {
    results: DetailCustomField[]
}

const CustomerDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 10

    const { data, isLoading } = useSWR(
        id ? ['/programs/programs', id] : null,
        () => apiGetProgramById<Customer>(id!),
        { revalidateOnFocus: false, revalidateIfStale: false },
    )

    const { data: participantsData, isLoading: participantsLoading, mutate: mutateParticipants } = useSWR(
        id ? ['/programs/participants', { program: id }] : null,
        () => apiGetProgramparticipantList<GetProgramParticipantsResponse, { program: string }>({ program: id! }),
        { revalidateOnFocus: false, revalidateIfStale: false },
    )

    const { data: customFieldsResponse } = useSWR(
        id ? ['/programs/participant-custom-fields', { program: id }] : null,
        () => apiGetParticipantCustomFields<CustomFieldsResponse, { program: string }>({ program: id! }),
        { revalidateOnFocus: false, revalidateIfStale: false },
    )

    const customFields = (customFieldsResponse?.results ?? [])
        .filter((field: DetailCustomField) => {
            const fieldProgId = field.program && typeof field.program === 'object' ? field.program.id : (field.program || field.program_id)
            return String(fieldProgId) === String(id)
        })

    const [addDialogOpen, setAddDialogOpen] = useState(false)
    const [isSubmittingParticipant, setIsSubmittingParticipant] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedParticipant, setSelectedParticipant] = useState<ProgramParticipant | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDeleteClick = (participant: ProgramParticipant) => {
        setSelectedParticipant(participant)
        setDeleteDialogOpen(true)
    }

    const handleDeleteConfirm = async () => {
        if (!selectedParticipant) return
        setIsDeleting(true)
        try {
            await apiDeleteProgramparticipant(String(selectedParticipant.id))
            toast.push(
                <Notification type="success">
                    Participant deleted successfully!
                </Notification>,
                { placement: 'top-center' }
            )
            mutateParticipants()
        } catch {
            toast.push(
                <Notification type="danger">
                    Failed to delete participant.
                </Notification>,
                { placement: 'top-center' }
            )
        } finally {
            setIsDeleting(false)
            setDeleteDialogOpen(false)
            setSelectedParticipant(null)
        }
    }
    const [participantForm, setParticipantForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        place: ''
    })
    const [customData, setCustomData] = useState<Record<string, CustomDataValue>>({})

    const handleAddParticipantSubmit = async () => {
        if (!participantForm.first_name) {
            toast.push(
                <Notification type="danger">
                    Name is required.
                </Notification>,
                { placement: 'top-center' }
            )
            return
        }

        // Validate custom fields
        for (const field of customFields) {
            if (field.is_required && !customData[field.field_key]) {
                toast.push(
                    <Notification type="danger">
                        {field.label} is required.
                    </Notification>,
                    { placement: 'top-center' }
                )
                return
            }
        }

        try {
            setIsSubmittingParticipant(true)

            const payload = {
                program: id!,
                first_name: participantForm.first_name,
                last_name: '',
                email: participantForm.email,
                phone: participantForm.phone,
                place: participantForm.place,
                custom_data: customData,
            }

            await apiCreateProgramparticipant(payload)

            toast.push(
                <Notification type="success">
                    Participant added successfully!
                </Notification>,
                { placement: 'top-center' }
            )

            setAddDialogOpen(false)
            mutateParticipants()
        } catch {
            toast.push(
                <Notification type="danger">
                    Failed to add participant.
                </Notification>,
                { placement: 'top-center' }
            )
        } finally {
            setIsSubmittingParticipant(false)
        }
    }

    const allParticipants = participantsData?.results ?? []
    const participantsList = allParticipants.filter((participant: ProgramParticipant) => {
        const pProgId = participant.program || participant.program_id;
        return String(pProgId) === String(id);
    })
    const totalParticipants = participantsList.length

    const downloadData = participantsList.map((item) => {
        const fullName = item.participant_name || `${item.first_name || ''} ${item.last_name || ''}`.trim() || '—';
        
        // Extract custom_data keys and include them in the row object flatly using custom field labels
        const flatCustomData: Record<string, string> = {};
        let customData = item.custom_data;
        if (typeof customData === 'string') {
            try {
                customData = JSON.parse(customData);
            } catch {
                customData = {};
            }
        }
        if (customData) {
            Object.entries(customData).forEach(([key, val]) => {
                const matchedField = customFields.find(f => f.field_key === key);
                const label = matchedField ? matchedField.label : key;
                
                // Format display value based on field type if necessary
                let displayVal = val;
                if (matchedField) {
                    if (matchedField.field_type === 'select') {
                        const opt = matchedField.options?.find((o: ParticipantCustomFieldOption) => o.value === val);
                        if (opt) displayVal = opt.label;
                    } else if (matchedField.field_type === 'checkbox') {
                        displayVal = val === true || val === 'true' || val === 1 || val === '1' ? 'Yes' : (val === false || val === 'false' || val === 0 || val === '0' ? 'No' : '—');
                    }
                }
                flatCustomData[label] = String(displayVal ?? '');
            });
        }

        return {
            Name: fullName,
            Email: item.email || '',
            Phone: item.phone || '',
            Place: item.place || '',
            ...flatCustomData,
            'Registered Date': item.created_at ? new Date(item.created_at).toLocaleDateString() : '',
        }
    })

    // Paginated calculations
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = Math.min(startIndex + pageSize, totalParticipants)
    const paginatedParticipants = participantsList.slice(startIndex, endIndex)

    const handleBack = () => navigate(-1)

    return (
        <Loading loading={isLoading}>
            <Container>

                {/* Header */}
                <div className="flex items-center px-6 md:px-10 py-6">
                    <button
                        type="button"
                        className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:opacity-70 transition"
                        onClick={handleBack}
                    >
                        <TbArrowNarrowLeft className="text-xl" />
                        Back
                    </button>
                </div>

                {/* Wider Layout */}
                <div className="px-6 md:px-10 pb-10 max-w-6xl mx-auto space-y-6">
                    {data && !isEmpty(data) ? (
                        <>
                            <div className="mb-4">
                                <h3 className="font-bold text-gray-900 dark:text-gray-100">{data.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">program details</p>
                            </div>
                            <Card className="rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">

                                {/* Bigger spacing */}
                                <div className="p-10 space-y-8">

                                    {/* Basic Info */}
                                    <div className="space-y-5">

                                        <div className="flex flex-col sm:flex-row sm:justify-between">
                                            <span className="text-gray-500 text-sm">Program</span>
                                            <span className="font-medium text-lg">
                                                {data.name || '—'}
                                            </span>
                                        </div>

                                        {data.code && (
                                            <div className="flex flex-col sm:flex-row sm:justify-between">
                                                <span className="text-gray-500 text-sm"> Code</span>
                                                <span className="font-medium text-lg">
                                                    {data.code || '—'}
                                                </span>
                                            </div>
                                        )}

                                        {/* description */}
                                        {data.description && (
                                            <div className="flex flex-col sm:flex-row sm:justify-between">
                                                <span className="text-gray-500 text-sm">Description</span>
                                                <span className="font-medium text-lg">
                                                    {data.description || '—'}
                                                </span>
                                            </div>
                                        )}
                                        {/* Start Date */}
                                        {data.start_date && (
                                            <div className="flex flex-col sm:flex-row sm:justify-between">
                                                <span className="text-gray-500 text-sm">Start Date</span>
                                                <span className="font-medium text-lg">
                                                    {new Date(data.start_date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        )}
                                        {/* End Date */}
                                        {data.end_date && (
                                            <div className="flex flex-col sm:flex-row sm:justify-between">
                                                <span className="text-gray-500 text-sm">End Date</span>
                                                <span className="font-medium text-lg">
                                                    {new Date(data.end_date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        )}




                                    </div>

                                    {/* Divider */}
                                    <div className="border-t border-gray-200 dark:border-gray-800" />

                                    {/* Custom Data */}
                                    {data.custom_data &&
                                        Object.keys(data.custom_data).length > 0 && (
                                            <div className="space-y-5">
                                                <h4 className="text-base text-gray-500">
                                                    Additional Details
                                                </h4>

                                                {Object.entries(data.custom_data).map(
                                                    ([key, value]) => (
                                                        <div
                                                            key={key}
                                                            className="flex flex-col sm:flex-row sm:justify-between gap-1"
                                                        >
                                                            <span className="text-gray-500 text-sm capitalize">
                                                                {key.replace(/_/g, ' ')}
                                                            </span>

                                                            <span className="font-medium text-lg break-words text-right">
                                                                {String(value || '—')}
                                                            </span>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        )}

                                    {/* Message */}
                                    {/* <div>
                                        <h4 className="text-base text-gray-500 mb-3">
                                            Message
                                        </h4>
                                        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 text-gray-700 dark:text-gray-200 whitespace-pre-wrap text-base leading-relaxed">
                                            {data.message || '—'}
                                        </div>
                                    </div> */}


                                </div>
                            </Card>

                            {/* Participants List */}
                            <Card className="rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                                <div className="p-10 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                                Program Participants
                                            </h3>
                                            <span className="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-semibold">
                                                {totalParticipants} registered
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            {totalParticipants > 0 && (
                                                <CSVLink
                                                    filename={`${data?.name || 'program'}_participants.csv`}
                                                    data={downloadData}
                                                >
                                                    <Button
                                                        size="sm"
                                                        icon={<TbCloudDownload className="text-xl" />}
                                                    >
                                                        Download
                                                    </Button>
                                                </CSVLink>
                                            )}
                                            <Button
                                                size="sm"
                                                variant="solid"
                                                onClick={() => {
                                                    setParticipantForm({
                                                        first_name: '',
                                                        last_name: '',
                                                        email: '',
                                                        phone: '',
                                                        place: ''
                                                    });
                                                    setCustomData({});
                                                    setAddDialogOpen(true);
                                                }}
                                            >
                                                Add Participant
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="border-t border-gray-200 dark:border-gray-800" />

                                    <Loading loading={participantsLoading}>
                                        {participantsList.length > 0 ? (
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left border-collapse">
                                                    <thead>
                                                        <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                                                            <th className="pb-3">
                                                                Participant
                                                            </th>
                                                            <th className="pb-3">
                                                                Email
                                                            </th>
                                                            <th className="pb-3">
                                                                Phone
                                                            </th>
                                                            <th className="pb-3">
                                                                Place
                                                            </th>
                                                            {customFields.map((field: DetailCustomField) => (
                                                                <th key={field.id || field.field_key} className="pb-3">
                                                                    {field.label}
                                                                </th>
                                                            ))}
                                                            <th className="pb-3 text-right">
                                                                Registered Date
                                                            </th>
                                                            <th className="pb-3 text-right">
                                                                Action
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                                                        {paginatedParticipants.map((participant: ProgramParticipant) => {
                                                            const fullName = participant.participant_name || 
                                                                `${participant.first_name || ''} ${participant.last_name || ''}`.trim() || 
                                                                '—';
                                                            
                                                            return (
                                                                <tr key={participant.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                                                    <td className="py-4 font-semibold text-gray-900 dark:text-gray-100">
                                                                        {fullName}
                                                                    </td>
                                                                    <td className="py-4 text-gray-500 dark:text-gray-400">
                                                                        {participant.email || '—'}
                                                                    </td>
                                                                    <td className="py-4 text-gray-500 dark:text-gray-400">
                                                                        {participant.phone || '—'}
                                                                    </td>
                                                                    <td className="py-4 text-gray-500 dark:text-gray-400">
                                                                        {participant.place || '—'}
                                                                    </td>
                                                                    {customFields.map((field: DetailCustomField) => {
                                                                        const val = participant.custom_data?.[field.field_key]
                                                                        let displayVal = val
                                                                        if (field.field_type === 'select') {
                                                                            const opt = field.options?.find((o: ParticipantCustomFieldOption) => o.value === val)
                                                                            if (opt) displayVal = opt.label
                                                                        } else if (field.field_type === 'checkbox') {
                                                                            displayVal = val === true || val === 'true' || val === 1 || val === '1' ? 'Yes' : (val === false || val === 'false' || val === 0 || val === '0' ? 'No' : '—')
                                                                        }
                                                                        return (
                                                                            <td key={field.id || field.field_key} className="py-4 text-gray-500 dark:text-gray-400">
                                                                                {String(displayVal ?? '—')}
                                                                            </td>
                                                                        )
                                                                    })}
                                                                    <td className="py-4 text-gray-500 dark:text-gray-400 text-right">
                                                                        {participant.created_at 
                                                                            ? new Date(participant.created_at).toLocaleDateString()
                                                                            : '—'}
                                                                    </td>
                                                                    <td className="py-4 text-right">
                                                                        <div className="flex justify-end gap-3">
                                                                            <Tooltip title="Edit">
                                                                                <div
                                                                                    className="text-xl cursor-pointer font-semibold"
                                                                                    role="button"
                                                                                    onClick={() => navigate(`/program-participants/edit/${participant.id}`, { state: { from: `/programs/${id}` } })}
                                                                                >
                                                                                    <TbPencil />
                                                                                </div>
                                                                            </Tooltip>
                                                                            <Tooltip title="View">
                                                                                <div
                                                                                    className="text-xl cursor-pointer font-semibold"
                                                                                    role="button"
                                                                                    onClick={() => navigate(`/program-participants/details/${participant.id}`)}
                                                                                >
                                                                                    <TbEye />
                                                                                </div>
                                                                            </Tooltip>
                                                                            <Tooltip title="Delete">
                                                                                <div
                                                                                    className="text-xl cursor-pointer font-semibold text-red-500 hover:text-red-700"
                                                                                    role="button"
                                                                                    onClick={() => handleDeleteClick(participant)}
                                                                                >
                                                                                    <TbTrash />
                                                                                </div>
                                                                            </Tooltip>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 space-y-3">
                                                <h4 className="text-lg font-medium text-gray-500 dark:text-gray-400">
                                                    No participants registered
                                                </h4>
                                                <p className="text-sm text-gray-400 dark:text-gray-500">
                                                    There are no participants registered under this program yet.
                                                </p>
                                            </div>
                                        )}

                                        {totalParticipants > 0 && (
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
                                                <div className="text-sm text-gray-500">
                                                    Showing {totalParticipants === 0 ? 0 : startIndex + 1} to {endIndex} of {totalParticipants} entries
                                                </div>
                                                <Pagination
                                                    currentPage={currentPage}
                                                    pageSize={pageSize}
                                                    total={totalParticipants}
                                                    onChange={(pageNumber) => setCurrentPage(pageNumber)}
                                                />
                                            </div>
                                        )}
                                    </Loading>
                                </div>
                            </Card>
                        </>
                    ) : (
                        <p className="text-sm opacity-70">No data found.</p>
                    )}
                </div>
            </Container>
            {/* Add Participant Dialog */}
            <Dialog
                isOpen={addDialogOpen}
                onClose={() => setAddDialogOpen(false)}
                onRequestClose={() => setAddDialogOpen(false)}
            >
                <div className="space-y-4">
                    <h5 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        Add New Participant
                    </h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Fill in the details below to register a new participant under this program.
                    </p>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">Name</label>
                        <Input
                            placeholder="Enter name"
                            value={participantForm.first_name}
                            onChange={(e) => setParticipantForm({ ...participantForm, first_name: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">Email Address</label>
                        <Input
                            type="email"
                            placeholder="Enter email address"
                            value={participantForm.email}
                            onChange={(e) => setParticipantForm({ ...participantForm, email: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">Phone Number</label>
                        <Input
                            placeholder="Enter phone number"
                            value={participantForm.phone}
                            onChange={(e) => setParticipantForm({ ...participantForm, phone: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">Place / City</label>
                        <Input
                            placeholder="Enter place / city"
                            value={participantForm.place}
                            onChange={(e) => setParticipantForm({ ...participantForm, place: e.target.value })}
                        />
                    </div>

                    {customFields.map((field: DetailCustomField) => {
                        const labelEl = (
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                                {field.label} {field.is_required && <span className="text-red-500">*</span>}
                            </label>
                        );

                        let inputEl = null;

                        switch (field.field_type) {
                            case 'select':
                                inputEl = (
                                    <Select
                                        isClearable={!field.is_required}
                                        options={field.options?.map((opt: ParticipantCustomFieldOption) => ({ label: opt.label, value: opt.value })) || []}
                                        placeholder={field.placeholder || `Select ${field.label}...`}
                                        value={
                                            field.options
                                                ?.map((opt: ParticipantCustomFieldOption) => ({ label: opt.label, value: opt.value }))
                                                .find((opt: { label: string; value: string }) => opt.value === customData[field.field_key]) || null
                                        }
                                        onChange={(opt: { label: string; value: string } | null) =>
                                            setCustomData({
                                                ...customData,
                                                [field.field_key]: opt?.value || '',
                                            })
                                        }
                                    />
                                );
                                break;
                            case 'textarea':
                                inputEl = (
                                    <Input
                                        textArea
                                        placeholder={field.placeholder || `Enter ${field.label}`}
                                        value={(customData[field.field_key] as string) || ''}
                                        onChange={(e) =>
                                            setCustomData({
                                                ...customData,
                                                [field.field_key]: e.target.value,
                                            })
                                        }
                                    />
                                );
                                break;
                            case 'checkbox':
                                if (field.options && field.options.length > 0) {
                                    inputEl = (
                                        <div className="flex flex-col gap-2 mt-1">
                                            {field.options.map((opt: ParticipantCustomFieldOption) => {
                                                const currentVals = Array.isArray(customData[field.field_key])
                                                    ? (customData[field.field_key] as string[])
                                                    : (customData[field.field_key] ? [String(customData[field.field_key])] : []);
                                                const isChecked = currentVals.includes(opt.value);

                                                return (
                                                    <Checkbox
                                                        key={opt.id || opt.value}
                                                        checked={isChecked}
                                                        onChange={(checked) => {
                                                            let nextVals: string[];
                                                            if (checked) {
                                                                nextVals = [...currentVals, opt.value];
                                                            } else {
                                                                nextVals = currentVals.filter((v: string) => v !== opt.value);
                                                            }
                                                            setCustomData({
                                                                ...customData,
                                                                [field.field_key]: nextVals,
                                                            });
                                                        }}
                                                    >
                                                        {opt.label}
                                                    </Checkbox>
                                                );
                                            })}
                                        </div>
                                    );
                                } else {
                                    inputEl = (
                                        <div className="flex items-center h-10">
                                            <Checkbox
                                                checked={!!customData[field.field_key]}
                                                onChange={(checked) =>
                                                    setCustomData({
                                                        ...customData,
                                                        [field.field_key]: checked,
                                                    })
                                                }
                                            >
                                                {field.placeholder || `Yes, ${field.label}`}
                                            </Checkbox>
                                        </div>
                                    );
                                }
                                break;
                            case 'number':
                                inputEl = (
                                    <Input
                                        placeholder={field.placeholder || `Enter ${field.label}`}
                                        type="number"
                                        value={(customData[field.field_key] as number | string) || ''}
                                        onChange={(e) =>
                                            setCustomData({
                                                ...customData,
                                                [field.field_key]: e.target.value,
                                            })
                                        }
                                    />
                                );
                                break;
                            case 'email':
                                inputEl = (
                                    <Input
                                        placeholder={field.placeholder || `Enter ${field.label}`}
                                        type="email"
                                        value={(customData[field.field_key] as string) || ''}
                                        onChange={(e) =>
                                            setCustomData({
                                                ...customData,
                                                [field.field_key]: e.target.value,
                                            })
                                        }
                                    />
                                );
                                break;
                            case 'phone':
                                inputEl = (
                                    <Input
                                        placeholder={field.placeholder || `Enter ${field.label}`}
                                        type="tel"
                                        value={(customData[field.field_key] as string) || ''}
                                        onChange={(e) =>
                                            setCustomData({
                                                ...customData,
                                                [field.field_key]: e.target.value,
                                            })
                                        }
                                    />
                                );
                                break;
                            case 'date':
                                inputEl = (
                                    <Input
                                        placeholder={field.placeholder || `Select ${field.label}`}
                                        type="date"
                                        value={(customData[field.field_key] as string) || ''}
                                        onChange={(e) =>
                                            setCustomData({
                                                ...customData,
                                                [field.field_key]: e.target.value,
                                            })
                                        }
                                    />
                                );
                                break;
                            case 'text':
                            default:
                                inputEl = (
                                    <Input
                                        placeholder={field.placeholder || `Enter ${field.label}`}
                                        type="text"
                                        value={(customData[field.field_key] as string) || ''}
                                        onChange={(e) =>
                                            setCustomData({
                                                ...customData,
                                                [field.field_key]: e.target.value,
                                            })
                                        }
                                    />
                                );
                        }

                        return (
                            <div key={field.id || field.field_key} className="space-y-1">
                                {labelEl}
                                {inputEl}
                            </div>
                        );
                    })}

                    <div className="flex justify-end gap-2 mt-6">
                        <Button
                            disabled={isSubmittingParticipant}
                            size="sm"
                            type="button"
                            onClick={() => setAddDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                         <Button
                            loading={isSubmittingParticipant}
                            size="sm"
                            type="button"
                            variant="solid"
                            onClick={handleAddParticipantSubmit}
                        >
                            Add
                        </Button>
                    </div>
                </div>
            </Dialog>

            <ConfirmDialog
                isOpen={deleteDialogOpen}
                type="danger"
                title={selectedParticipant ? `Delete "${selectedParticipant.participant_name || `${selectedParticipant.first_name || ''} ${selectedParticipant.last_name || ''}`.trim()}"` : 'Delete Participant'}
                onClose={() => { setDeleteDialogOpen(false); setSelectedParticipant(null); }}
                onRequestClose={() => { setDeleteDialogOpen(false); setSelectedParticipant(null); }}
                onCancel={() => { setDeleteDialogOpen(false); setSelectedParticipant(null); }}
                onConfirm={handleDeleteConfirm}
                confirmButtonProps={{ loading: isDeleting }}
            >
                <p>
                    Are you sure you want to delete "{selectedParticipant ? (selectedParticipant.participant_name || `${selectedParticipant.first_name || ''} ${selectedParticipant.last_name || ''}`.trim()) : ''}"?
                    This action cannot be undone.
                </p>
            </ConfirmDialog>
        </Loading>
    )
}

export default CustomerDetails