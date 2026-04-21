import { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Avatar from '@/components/ui/Avatar'
import { FormItem } from '@/components/ui/Form'
import { Controller, useWatch, useForm } from 'react-hook-form'
import { components } from 'react-select'
import type { FormSectionBaseProps } from './types'
import type { ControlProps, OptionProps } from 'react-select'
import { apiGetOrganizations, apiGetZones } from '@/services/CustomersService'

type OverviewSectionProps = FormSectionBaseProps
type CountryOption = {
    label: string
    dialCode: string
    value: string
}
type ZoneOption = {
    value: string
    label: string
}
type OrganizationOption = {
    value: string
    label: string
}

const { Control } = components

const CustomSelectOption = (props: OptionProps<CountryOption>) => {
    return (
        <Select.Option<CountryOption>
            {...props}
            customLabel={(data) => (
                <span className="flex items-center gap-2">
                    <Avatar
                        className="ltr:mr-2 rtl:ml-2"
                        shape="circle"
                        size={20}
                        src={`/img/countries/${data.value}.png`}
                    />
                    <span>{data.dialCode}</span>
                </span>
            )}
        />
    )
}

const CustomControl = ({ children, ...props }: ControlProps<CountryOption>) => {
    const selected = props.getValue()[0]
    return (
        <Control {...props}>
            {selected && (
                <Avatar
                    className="ltr:mr-4 rtl:ml-4"
                    shape="circle"
                    size={20}
                    src={`/img/countries/${selected.value}.png`}
                />
            )}
            {children}
        </Control>
    )
}

const OverviewSection = ({ control, errors }: OverviewSectionProps) => {
    const [zones, setZones] = useState<ZoneOption[]>([])
    const [organizations, setOrganizations] = useState<OrganizationOption[]>([])
    const [loadingZones, setLoadingZones] = useState(false)

    const orderType = useWatch({
        control,
        name: 'order_type',
    })

    useEffect(() => {
        const loadZonesAndOrganizations = async () => {
            try {
                setLoadingZones(true)
                const [zonesRes, organizationsRes] = await Promise.all([
                    apiGetZones<any, {}>({}),
                    apiGetOrganizations<any, {}>({}),
                ])
                const zoneList = zonesRes.results || zonesRes.data || zonesRes
                const organizationList =
                    organizationsRes.results ||
                    organizationsRes.data ||
                    organizationsRes

                const zoneOptions = (zoneList || []).map((zone: any) => ({
                    value: String(zone.id),
                    label: zone.zone_name,
                }))
                const organizationOptions = (organizationList || []).map(
                    (organization: any) => ({
                        value: String(organization.id),
                        label: organization.organization_name,
                    }),
                )

                setZones(zoneOptions)
                setOrganizations(organizationOptions)
            } catch (err) {
                // console.error('Failed to fetch zones and organizations:', err)
            } finally {
                setLoadingZones(false)
            }
        }
        loadZonesAndOrganizations()
    }, [])

    return (
        <Card>
            <h4 className="mb-6">Orders List</h4>
            <div className="grid md:grid-cols-2 gap-4">
                <FormItem
                    label="Name"
                    invalid={Boolean(errors.order_by_name)}
                    errorMessage={errors.order_by_name?.message}
                >
                    <Controller
                        name="order_by_name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="Name"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Mobile"
                    invalid={Boolean(errors.mobile)}
                    errorMessage={errors.mobile?.message}
                >
                    <Controller
                        name="mobile"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="Mobile Number"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
            </div>

            <FormItem
                label="Quantity"
                invalid={Boolean(errors.quantity)}
                errorMessage={errors.quantity?.message}
            >
                <Controller
                    name="quantity"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="number"
                            min={1}
                            step={1}
                            autoComplete="off"
                            placeholder="Quantity"
                            value={field.value}
                            onChange={(e) => {
                                const val = e.target.value
                                if (val === '' || Number(val) >= 1) {
                                    field.onChange(val)
                                }
                            }}
                        />
                    )}
                />
            </FormItem>

            <div className="grid md:grid-cols-2 gap-4">
                <FormItem
                    label="Delivery Place"
                    invalid={Boolean(errors.delivery_place)}
                    errorMessage={errors.delivery_place?.message}
                >
                    <Controller
                        name="delivery_place"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="Delivery Place"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                {/* ✅ Zone dropdown */}
                <FormItem
                    label="Zone"
                    invalid={Boolean(errors.zone)}
                    errorMessage={errors.zone?.message}
                >
                    <Controller
                        name="zone"
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={zones}
                                isLoading={loadingZones}
                                placeholder={
                                    loadingZones
                                        ? 'Loading zones...'
                                        : 'Select zone'
                                }
                                value={field.value || null}
                                onChange={(option) => field.onChange(option)}
                            />
                        )}
                    />
                </FormItem>

                {/* ✅ Order type */}
                <FormItem
                    label="Order Type"
                    invalid={Boolean(errors.order_type)}
                    errorMessage={errors.order_type?.message}
                >
                    <Controller
                        name="order_type"
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={[
                                    { value: 'individual', label: 'Individual' },
                                    { value: 'organization', label: 'Organization' },
                                ]}
                                value={
                                    [
                                        { value: 'individual', label: 'Individual' },
                                        { value: 'organization', label: 'Organization' },
                                    ].find((o) => o.value === field.value) ||
                                    null
                                }
                                onChange={(option) =>
                                    field.onChange(option?.value)
                                }
                            />
                        )}
                    />
                </FormItem>

                {/* ✅ Organization dropdown (only if Organization type selected) */}
                {orderType === 'organization' && (
                    <FormItem
                        label="Organization Name"
                        invalid={Boolean(errors.organization)}
                        errorMessage={errors.organization?.message}
                    >
                        <Controller
                            name="organization"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    options={organizations}
                                    isLoading={loadingZones}
                                    placeholder={
                                        loadingZones
                                            ? 'Loading organizations...'
                                            : 'Select organization'
                                    }
                                    value={field.value || null}
                                    onChange={(option) => field.onChange(option)}
                                />
                            )}
                        />
                    </FormItem>
                )}

                {/* ✅ Status dropdown */}
                <FormItem
                    label="Status"
                    invalid={Boolean(errors.status)}
                    errorMessage={errors.status?.message}
                >
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={[
                                    { value: 'INITIATED', label: 'Initiated' },
                                    { value: 'APPROVED', label: 'Approved' },
                                    { value: 'DELIVERED', label: 'Delivered' },
                                    { value: 'CANCELLED', label: 'Cancelled' },
                                ]}
                                value={
                                    [
                                        { value: 'INITIATED', label: 'Initiated' },
                                        { value: 'APPROVED', label: 'Approved' },
                                        { value: 'DELIVERED', label: 'Delivered' },
                                        { value: 'CANCELLED', label: 'Cancelled' },
                                    ].find((o) => o.value === field.value) || null
                                }
                                onChange={(option) =>
                                    field.onChange(option?.value)
                                }
                                placeholder="Select Status"
                            />
                        )}
                    />
                </FormItem>

                {/* ✅ Is Paid dropdown with default = false */}
                <FormItem
                    label="Is Paid"
                    invalid={Boolean(errors.is_paid)}
                    errorMessage={errors.is_paid?.message}
                >
                    <Controller
                        name="is_paid"
                        control={control}
                        rules={{ required: "Please select Paid or Not Paid" }}
                        render={({ field }) => (
                            <Select
                                options={[
                                    { value: true, label: "Paid" },
                                    { value: false, label: "Not Paid" },
                                ]}
                                value={[
                                    { value: true, label: "Paid" },
                                    { value: false, label: "Not Paid" },
                                ].find((o) => o.value === field.value) || null}
                                onChange={(option) => field.onChange(option?.value)}
                                placeholder="Select payment status"
                            />
                        )}
                    />
                </FormItem>
            
                
                <FormItem
                    label="Payment Note"
                    invalid={Boolean(errors.payment_note)}
                    errorMessage={errors.payment_note?.message}
                >
                    <Controller
                        name="payment_note"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="Payment Note"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

            </div>
        </Card>
    )
}

export default OverviewSection
