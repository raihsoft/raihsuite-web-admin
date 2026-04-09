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
            <h4 className="mb-6">Zones List</h4>
            <div className="grid md:grid-cols-2 gap-4">
                <FormItem
                    label="Zone Name"
                    invalid={Boolean(errors.zone_name)}
                    errorMessage={errors.zone_name?.message}
                >
                    <Controller
                        name="zone_name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="Zone Name"
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
