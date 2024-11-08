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
    return (
        <div className={`${isOpen ? "opacity-100" : "pointer-events-none"} grid opacity-0 transition-all duration-300 modal-overlay fixed bg-black bg-opacity-40 top-0 left-0 right-0 bottom-0 place-items-center !z-[1500]`}>
            <div className={`flex flex-col bg-white w-[80vw] h-fit rounded-xl transition-all duration-500 `}>
                <div className='p-5 flex flex-col'>
                    <span className='font-bold text-lg border-gray-200'>{title}</span>
                    <span className='text-gray-500 text-sm mt-3'>{content}</span>
                    <div className='flex flex-col mt-6 gap-2'>
                        <Button className={`w-full font-medium py-2 ${type === 'delete' && 'bg-red-400'}`}
                                variant={confirmBtnVariant}
                                onClick={onConfirm}
                        > {confirmBtnLabel}</Button>
                        <Button className='w-full text-sm py-2 font-medium ' 
                                variant='secondary'
                                onClick={onClose}
                        > Cancel</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationModal