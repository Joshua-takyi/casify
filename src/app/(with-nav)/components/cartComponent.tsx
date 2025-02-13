import Wrapper from "@/components/wrapper";


export  default  function CartComponent(){
    return(
        <main>
            <Wrapper>
                <div className={`grid md:grid-cols-5 grid-cols-1`}>
                    <div className={`col-span-2`}>
                    </div>
                    <div className={`col-span-2`}>
                    </div>
                </div>
            </Wrapper>
        </main>
    )
}