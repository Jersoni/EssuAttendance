import { Button } from '@/components'
import { ConfirmationModalProps } from '@/types'

const ConfirmationModal: React.FC<ConfirmationModalProps> = (
    {
        isOpen, 
        title, 
        content, 
        onConfirm, 
        onClose, 
        confirmBtnLabel = 'Confirm', 
        confirmBtnVariant = 'primary',
        type = 'default'
    }
) => {

    if(!isOpen) return null

    return (
        <div className="modal-overlay fixed bg-black bg-opacity-60 top-0 left-0 right-0 bottom-0 grid place-items-center p-5 !z-[500]">
            <div className="bg-white w-full h-fit p-5 rounded-2xl text-center">
                <div className='flex flex-col gap-3'>
                    <span className='font-semibold'>{title}</span>
                    <span className='text-sm text-gray-600'>{content}</span>
                </div>
                <div className='mt-8 flex flex-row gap-3'>
                    <Button className='w-full ' 
                            variant='secondary'
                            onClick={onClose}
                    > Cancel</Button>
                    <Button className={`w-full ${type === 'delete' && 'bg-red-400'}`}
                            variant={confirmBtnVariant}
                            onClick={onConfirm}
                    > {confirmBtnLabel}</Button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationModal