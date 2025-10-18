interface TitleProps {
    value: string
}

export default function Title({value} : TitleProps) {
    return (
       <h1 className="text-2xl">
        {value}
       </h1>
    )
}