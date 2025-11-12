import Button from "../../button"
import Title from "../../title"
import Whiteboard from "../../whiteboard"

interface ModalProps {
    title: string,
    children: any,
    onStart: () => void,
}

export default function NewDayModal({ title, children, onStart }: ModalProps) {
    return (
        <div
            className="w-screen h-screen bg-primary-900/75 fixed inset-0 flex items-center justify-center z-50"
            onClick={(e) => {
                e.stopPropagation()
            }}
        >
            <div
                className="w-lg max-w-full bg-primary-600 sm:p-6 p-2 rounded-lg flex flex-col items-center gap-4"

            >
                <div className="flex justify-between items-center">
                    <Title value={title} style="text-lg"></Title>
                </div>
                <Whiteboard>
                    {children}
                </Whiteboard>
               <Button action={onStart} text="start a new day" type="primary" style="max-w-full w-60 h-8"/>
            </div>
        </div>
    )
}