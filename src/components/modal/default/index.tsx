import { useEffect, useRef } from "react"
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
    const modalContentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur()
        }
        
        document.body.style.overflow = 'hidden'

        return () => {
            document.body.style.overflow = ''
        }
    }, [])


    return (
        <div
          className="w-screen h-screen bg-primary-900/75 fixed inset-0 flex items-center justify-center z-50 overflow-y-auto"
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
            <div
              ref={modalContentRef}
              className="w-full m-4 max-w-lg bg-primary-600 p-6 rounded-lg flex flex-col gap-4"
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