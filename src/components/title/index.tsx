interface TitleProps {
    value: string,
    style?: string
}

export default function Title({style, value} : TitleProps) {
    return (
       <h1 className={`${style}`}>
        {value}
       </h1>
    )
}