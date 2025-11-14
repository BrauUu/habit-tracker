interface WhiteboardProps {
    children?: any
}

export default function Whiteboard({ children }: WhiteboardProps) {
    return (
        <div className="w-full flex-1 min-h-0 bg-primary-800 rounded-lg p-4 flex flex-col gap-4">
            {children}
        </div>
    )
}