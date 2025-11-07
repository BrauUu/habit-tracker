interface WhiteboardProps {
    children?: any
}

export default function Whiteboard({ children }: WhiteboardProps) {

    return (
        <div className="w-full overflow-scroll bg-primary-700 rounded-lg p-4 flex flex-col gap-4" >
            {children}
        </div>
    )
}