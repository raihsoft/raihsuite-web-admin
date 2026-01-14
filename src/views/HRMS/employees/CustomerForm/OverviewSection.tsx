import { useMemo } from 'react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select, { Option as DefaultOption } from '@/components/ui/Select'
import Avatar from '@/components/ui/Avatar'
import { FormItem } from '@/components/ui/Form'
import NumericInput from '@/components/shared/NumericInput'
import { countryList } from '@/constants/countries.constant'
import { Controller } from 'react-hook-form'
import { components } from 'react-select'
import type { FormSectionBaseProps } from './types'
import type { ControlProps, OptionProps } from 'react-select'

type OverviewSectionProps = FormSectionBaseProps
type CountryOption = {
  label: string
  dialCode: string
  value: string
}

const { Control } = components

const CustomSelectOption = (props: OptionProps<CountryOption>) => {
  return (
    <DefaultOption<CountryOption>
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
  const dialCodeList = useMemo(() => {
    const newCountryList: Array<CountryOption> = JSON.parse(
      JSON.stringify(countryList),
    )
    return newCountryList.map((country) => {
      country.label = country.dialCode
      return country
    })
  }, [])

  return (
    <Card>
      <h4 className="mb-6">Edit Employees</h4>
      
      {/* Profile Image removed per request */}

      <div className="grid md:grid-cols-2 gap-4">
        <FormItem
          label="Name"
          invalid={Boolean(errors.name)}
          errorMessage={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                autoComplete="off"
                placeholder=" Name"
                {...field}
              />
            )}
          />
        </FormItem>
        <FormItem
          label="Email"
          invalid={Boolean(errors.email_link)}
          errorMessage={errors.email_link?.message}
        >
          <Controller
            name="email_link"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                autoComplete="off"
                placeholder="Email"
                {...field}
              />
            )}
          />
        </FormItem>
      </div>
      <FormItem
        label="Designation"
        invalid={Boolean(errors.designation)}
        errorMessage={errors.designation?.message}
      >
        <Controller
          name="designation"
          control={control}
          render={({ field }) => (
            <Input
              type="text"
              autoComplete="off"
              placeholder="Designation"
              {...field}
            />
          )}
        />
      </FormItem>
      <div className="grid md:grid-cols-2 gap-4">
        <FormItem
          label="organization"
          invalid={Boolean(errors.organization)}
          errorMessage={errors.organization?.message}
        >
          <Controller
            name="organization"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                autoComplete="off"
                placeholder=" Organization"
                {...field}
              />
            )}
          />
        </FormItem>
        <FormItem
          label="Facebook"
          invalid={Boolean(errors.facebook_link)}
          errorMessage={errors.facebook_link?.message}
        >
          <Controller
            name="facebook_link"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                autoComplete="off"
                placeholder="Facebook URL"
                {...field}
              />
            )}
          />
        </FormItem>
        <FormItem
          label="YouTube"
          invalid={Boolean(errors.youtube_link)}
          errorMessage={errors.youtube_link?.message}
        >
          <Controller
            name="youtube_link"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                autoComplete="off"
                placeholder="YouTube URL"
                {...field}
              />
            )}
          />
        </FormItem>
        <FormItem
          label="Instagram"
          invalid={Boolean(errors.instagram_link)}
          errorMessage={errors.instagram_link?.message}
        >
          <Controller
            name="instagram_link"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                autoComplete="off"
                placeholder="Instagram URL"
                {...field}
              />
            )}
          />
        </FormItem>
        <FormItem
          label="LinkedIn"
          invalid={Boolean(errors.linkedin_link)}
          errorMessage={errors.linkedin_link?.message}
        >
          <Controller
            name="linkedin_link"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                autoComplete="off"
                placeholder="LinkedIn URL"
                {...field}
              />
            )}
          />
        </FormItem>
        <FormItem
          label="Website"
          invalid={Boolean(errors.website_link)}
          errorMessage={errors.website_link?.message}
        >
          <Controller
            name="website_link"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                autoComplete="off"
                placeholder="Website URL"
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
