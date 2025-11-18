import { useEffect, useMemo, useState } from 'react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import ReactSelect from 'react-select'
import { apiAssetType, apiGetAssetCategories } from '@/services/CustomersService'
import { countryList } from '@/constants/countries.constant'
import type { FormSectionBaseProps } from './types'

type OverviewSectionProps = FormSectionBaseProps

type AssetTypeOption = {
    label: string
    value: string
}

type CountryOption = {
    label: string
    dialCode: string
    value: string
}

const OverviewSection = ({ control, errors }: OverviewSectionProps) => {
    const [assetTypeOptions, setAssetTypeOptions] = useState<AssetTypeOption[]>([])
    const [assetCategoryOptions, setAssetCategoryOptions] = useState<AssetTypeOption[]>([])

    // ✅ Fetch Asset Types
    useEffect(() => {
        const fetchAssetTypes = async () => {
            try {
                const response = await apiAssetType<any, any>({})
                const results = response?.results || []
                const options = results.map((item: any) => ({
                    label: item.name,
                    value: item.id,
                }))
                setAssetTypeOptions(options)
            } catch (error) {
                console.error('❌ Error fetching asset types:', error)
            }
        }
        fetchAssetTypes()
    }, [])

    // ✅ Fetch Asset Categories
    useEffect(() => {
        const fetchAssetCategories = async () => {
            try {
                const response = await apiGetAssetCategories<any, any>({})
                const results = response?.results || []
                const options = results.map((item: any) => ({
                    label: item.name,
                    value: item.id,
                }))
                setAssetCategoryOptions(options)
            } catch (error) {
                console.error('❌ Error fetching asset categories:', error)
            }
        }
        fetchAssetCategories()
    }, [])

    // 🌍 Country Dial Codes (optional / reference)
    const dialCodeList = useMemo(() => {
        const newCountryList: Array<CountryOption> = JSON.parse(JSON.stringify(countryList))
        return newCountryList.map((country) => {
            country.label = country.dialCode
            return country
        })
    }, [])

    return (
        <Card>
            <h4 className="mb-6 font-semibold text-lg">Overview</h4>

            {/* 🔹 Title & File Type */}
            <div className="grid md:grid-cols-2 gap-4">
                <FormItem
                    label="Title"
                    invalid={Boolean(errors.title)}
                    errorMessage={errors.title?.message}
                >
                    <Controller
                        name="title"
                        control={control}
                        render={({ field }) => (
                            <Input type="text" autoComplete="off" placeholder="Title" {...field} />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="File Type"
                    invalid={Boolean(errors.file_type)}
                    errorMessage={errors.file_type?.message}
                >
                    <Controller
                        name="file_type"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="File Type"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
            </div>

            {/* 🔹 File Upload */}
            <FormItem
                label="Upload File"
                invalid={Boolean(errors.file)}
                errorMessage={errors.file?.message}
            >
                <Controller
                    name="file"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={(e) => field.onChange(e.target.files?.[0])}
                        />
                    )}
                />
            </FormItem>

            {/* 🔹 Asset Type */}
            <FormItem
                label="Asset Type"
                invalid={Boolean(errors.asset_type_ref)}
                errorMessage={errors.asset_type_ref?.message}
            >
                <Controller
                    name="asset_type_ref"
                    control={control}
                    render={({ field }) => (
                        <ReactSelect
                            {...field}
                            options={assetTypeOptions}
                            placeholder="Select Asset Type"
                            value={assetTypeOptions.find((opt) => opt.value === field.value)}
                            onChange={(option) => field.onChange(option?.value)}
                            styles={{
                                menu: (provided) => ({
                                    ...provided,
                                    zIndex: 9999,
                                }),
                            }}
                        />
                    )}
                />
            </FormItem>

            {/* 🔹 Asset Category */}
            <FormItem
                label="Asset Category"
                invalid={Boolean(errors.asset_category)}
                errorMessage={errors.asset_category?.message}
            >
                <Controller
                    name="asset_category"
                    control={control}
                    render={({ field }) => (
                        <ReactSelect
                            {...field}
                            options={assetCategoryOptions}
                            placeholder="Select Asset Category"
                            value={assetCategoryOptions.find((opt) => opt.value === field.value)}
                            onChange={(option) => field.onChange(option?.value)}
                            styles={{
                                menu: (provided) => ({
                                    ...provided,
                                    zIndex: 9999,
                                }),
                            }}
                        />
                    )}
                />
            </FormItem>

            {/* 🔹 Tags */}
            <FormItem
                label="Tags"
                invalid={Boolean(errors.tags)}
                errorMessage={errors.tags?.message}
            >
                <Controller
                    name="tags"
                    control={control}
                    render={({ field }) => (
                        <Input type="text" autoComplete="off" placeholder="Tags" {...field} />
                    )}
                />
            </FormItem>

            {/* 🔹 Description */}
            <FormItem
                label="Description"
                invalid={Boolean(errors.description)}
                errorMessage={errors.description?.message}
            >
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="text"
                            autoComplete="off"
                            placeholder="Description"
                            {...field}
                        />
                    )}
                />
            </FormItem>
        </Card>
    )
}

export default OverviewSection
