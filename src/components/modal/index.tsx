import Title from "../title"

interface ModalProps {
    title: string,
    children: any,
    onClose: () => void,
    onSave: () => void
}

export default function Modal({title, children, onClose, onSave }: ModalProps) {
    return (
        <div
          className="w-screen h-screen bg-primary-600/60 fixed inset-0 flex items-center justify-center z-50"
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
            <div
              className="w-lg max-w-full bg-primary-500 sm:p-6 p-2 rounded-lg flex flex-col gap-4"
              
            >
                <div className="flex justify-between items-center">
                    <Title value={title} style="text-lg"></Title>
                    <div className="flex justify-end gap-4">
                        <button onClick={(e) => {
                            e.stopPropagation()
                            onClose()
                        }} aria-label="close">
                            cancel
                        </button>
                        <button
                            className='px-1.5 py-0.5 rounded-sm bg-secondary text-primary-500'
                            onClick={(e) => {
                                e.stopPropagation()
                                onSave()
                            }}
                        >
                            save
                        </button>
                    </div>
                </div>
                {children}
            </div>
        </div>
    )
}