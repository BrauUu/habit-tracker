import Button from "../../button"
import Title from "../../title"

interface ModalProps {
    title: string,
    confirmButtonText?: string,
    cancelButtonText?: string,
    children: any,
    onClose: () => void,
    onSave: () => void
}

export default function Modal({title, children, onClose, onSave, confirmButtonText = 'save', cancelButtonText = 'cancel' }: ModalProps) {
    return (
        <div
          className="w-screen h-screen bg-primary-900/75 fixed inset-0 flex items-center justify-center z-50"
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
            <div
              className="w-lg max-w-full bg-primary-600 sm:p-6 p-2 rounded-lg flex flex-col gap-4"
              
            >
                <div className="flex justify-between items-center">
                    <Title value={title} style="text-lg"></Title>
                    <div className="flex justify-end gap-2">
                       <Button action={onClose} type="secondary" text={cancelButtonText}/>
                       <Button action={onSave} type="primary" text={confirmButtonText}/>
                    </div>
                </div>
                {children}
            </div>
        </div>
    )
}