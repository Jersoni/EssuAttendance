import { ConfirmationModalProps } from '@/types'
import { Button } from '@/components'

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({isOpen, content, onConfirm, onClose, confirmBtnLabel = 'Confirm'}) => {

    if(!isOpen) return null

    return (
        <div className="modal-overlay fixed bg-black bg-opacity-30 top-0 left-0 right-0 bottom-0 grid place-items-center p-5">
            <div className="bg-white w-fit h-fit p-5 rounded-xl text-center">
                <span>{`${content}`}</span>
                <div className='mt-5 flex flex-row gap-2'>
                    <Button className='w-full rounded-lg' 
                            variant='secondary'>Cancel</Button>
                    <Button className='w-full rounded-lg'>{confirmBtnLabel}</Button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationModal