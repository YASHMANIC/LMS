import Image from "next/image";


const Logo = () => {
    return(
        <div>
            <Image src={"/logo.svg"} alt={"logo"} height={50} width={50} />
        </div>
    )
}
export default Logo