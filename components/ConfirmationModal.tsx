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
        <div className="modal-overlay fixed bg-black bg-opacity-30 top-0 left-0 right-0 bottom-0 grid place-items-center p-10 !z-[500]">
            <div className="flex flex-col bg-white w-full h-fit rounded-lg text-center">
                <span className='font-semibold border-b border-gray-200 py-3'>{title}</span>
                <div className='p-4'>
                    <span className='text-sm text-gray-600 mt-2'>{content}</span>
                    <div className='flex flex-row mt-6 gap-3'>
                        <Button className='w-full text-sm font-medium ' 
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
        </div>
    )
}

export default ConfirmationModal