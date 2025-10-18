interface PlaceholderProps {
    placeholder: string,
    onSubmit: (value: string) => void 
}

export default function Input({ placeholder, onSubmit }: PlaceholderProps) {

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>){
        if (event.key === 'Enter') {
            onSubmit(event.currentTarget.value)
        }
    }

    return (
        <input
            type="text"
            className={`
            bg-primary-600 rounded-lg w-full h-10 p-2
            focus:outline-0
            `}
            placeholder={placeholder}
            onKeyDown={handleKeyDown}
        ></input>
    )
}