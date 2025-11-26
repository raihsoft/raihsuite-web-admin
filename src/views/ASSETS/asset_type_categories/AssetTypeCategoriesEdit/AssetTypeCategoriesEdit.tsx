import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import { TbArrowNarrowLeft } from 'react-icons/tb'
import { useParams, useNavigate } from 'react-router-dom'

const AssetTypeCategoriesEdit = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleBack = () => navigate(-1)

    return (
        <>
            <Container>
                <div className="flex items-center justify-between px-8">
                    <Button
                        type="button"
                        variant="plain"
                        icon={<TbArrowNarrowLeft />}
                        onClick={handleBack}
                    >
                        Back
                    </Button>
                    <div className="flex items-center">
                        <Button variant="solid" type="button" loading={isSubmitting}>
                            Save
                        </Button>
                    </div>
                </div>
                <div className="p-8">
                    <h3 className="text-lg font-semibold">Edit Asset Type Category</h3>
                    <p className="mt-4 text-sm text-gray-600">ID: {id}</p>
                    <p className="mt-3 text-sm text-gray-600">Replace this with the actual edit form.</p>
                </div>
            </Container>
        </>
    )
}

export default AssetTypeCategoriesEdit
