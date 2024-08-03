import { ConfirmationModalProps } from '@/types'
import { Button } from '@/components'

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({isOpen, title, content, onConfirm, onClose, confirmBtnLabel = 'Confirm', confirmBtnVariant = 'primary'}) => {

    if(!isOpen) return null

    return (
        <div className="modal-overlay fixed bg-black bg-opacity-30 top-0 left-0 right-0 bottom-0 grid place-items-center p-5 !z-[200]">
            <div className="bg-white w-fit h-fit p-5 rounded-xl text-center">
                <div className='flex flex-col gap-3'>
                    <span className='font-semibold'>{title}</span>
                    <span className='text-sm'>{content}</span>
                </div>
                <div className='mt-8 flex flex-row gap-3'>
                    <Button className='w-full rounded-lg' 
                            variant='secondary'
                            onClick={onClose}
                    > Cancel</Button>
                    <Button className='w-full rounded-lg' 
                            variant={confirmBtnVariant}
                            onClick={onConfirm}
                    > {confirmBtnLabel}</Button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationModal