import { UserCircleIcon } from "@heroicons/react/24/outline"
import { useState } from "react"
import Dropdown from "../components/dropdown/index"

export default function UserSection() {

    const [isShowingDropdown, setIsShowingDropdown] = useState(false)

    return (
        <div className="relative justify-end flex items-center gap-2 text-xl cursor-pointer p-2" onClick={() => setIsShowingDropdown(!isShowingDropdown)}>
            <h2 className="">hi, user! </h2>
            <UserCircleIcon className='h-12 w-12'></UserCircleIcon>
            {isShowingDropdown && <div className="absolute mt-10"><Dropdown/></div>
                
            }
        </div>
    )
}