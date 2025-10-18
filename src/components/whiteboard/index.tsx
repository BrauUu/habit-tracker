interface WhiteboardProps {
    children?: any
}

export default function Whiteboard({children} : WhiteboardProps) {
    return (
        <div className="w-full md:w-1/2 lg:w-1/4 bg-primary-700 rounded-lg p-4 flex flex-col gap-4">
            {children}
        </div>
    )
}