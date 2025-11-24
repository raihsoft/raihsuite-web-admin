import { useEffect, useState } from 'react'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Container from '@/components/shared/Container'

type CardValues = {
    cardHolderName?: string
    ccNumber?: string
    cardExpiry?: string
    code?: string
}

type CreditCardDialogProps = {
    title?: string
    defaultValues?: CardValues
    dialogOpen: boolean
    onDialogClose: () => void
    onSubmit: (values: CardValues) => void
}

const CreditCardDialog = ({
    title = 'Credit Card',
    defaultValues = {},
    dialogOpen,
    onDialogClose,
    onSubmit,
}: CreditCardDialogProps) => {
    const [values, setValues] = useState<CardValues>({})

    useEffect(() => setValues(defaultValues), [defaultValues])

    const handleChange = (key: keyof CardValues, v: string) => {
        setValues((s) => ({ ...s, [key]: v }))
    }

    const handleSubmit = () => {
        onSubmit(values)
    }

    return (
        <Dialog isOpen={dialogOpen} onClose={onDialogClose} width={520}>
            <Container>
                <div className="py-4">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <div className="mt-4 grid grid-cols-1 gap-3">
                        <Input
                            label="Card holder"
                            value={values.cardHolderName || ''}
                            onChange={(e) => handleChange('cardHolderName', e.target.value)}
                        />
                        <Input
                            label="Card number"
                            value={values.ccNumber || ''}
                            onChange={(e) => handleChange('ccNumber', e.target.value)}
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                label="Expiry (MMYY)"
                                value={values.cardExpiry || ''}
                                onChange={(e) => handleChange('cardExpiry', e.target.value)}
                            />
                            <Input
                                label="CVC"
                                value={values.code || ''}
                                onChange={(e) => handleChange('code', e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end gap-3 mt-4">
                            <Button variant="plain" type="button" onClick={onDialogClose}>
                                Cancel
                            </Button>
                            <Button variant="solid" type="button" onClick={handleSubmit}>
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            </Container>
        </Dialog>
    )
}

export default CreditCardDialog
