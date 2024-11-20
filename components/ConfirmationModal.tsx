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
        type = 'default',
        className
    }
) => {
    return (
        <div className={`${isOpen ? "opacity-100" : "pointer-events-none"} grid opacity-0 transition-all duration-300 fixed bg-black bg-opacity-10 !backdrop-blur-sm top-0 left-0 right-0 bottom-0 place-items-center !z-[1500] ${className}`}>
            <div className={`flex flex-col border border-gray-300 bg-white w-[80vw] h-fit rounded-xl transition-all duration-500 shadow-lg `}>
                <div className='p-5 flex flex-col'>
                    <span className='font-bold text-lg border-gray-200'>{title}</span>
                    <span className='text-gray-600 text-sm mt-1'>{content}</span>
                    <div className='flex flex-row mt-7 gap-2'>
                        <Button className='w-full px-0 text-sm py-2.5 !bg-gray-200 font-semibold text-gray-700 ' 
                                variant='secondary'
                                onClick={onClose}
                        > Cancel</Button>
                        <Button className={`w-full px-0 font-semibold py-2.5 border ${type === 'delete' ? 'bg-red-400 border-red-500 active:border-red-400 active:bg-red-300' : 'border-green-700'}`}
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