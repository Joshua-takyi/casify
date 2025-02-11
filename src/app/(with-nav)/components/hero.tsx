
"use client"
import {motion } from "framer-motion"
import Wrapper from "@/components/wrapper";
import Link from "next/link";

const genderSelect = [
    {
        id: 1,
        name: "shop masculine",
        path: "/male-preference",
        bgColor: "rgb(30, 30, 30)" // Dark background
    },
    {
        id: 2,
        name: "shop feminine",
        path: "/female-preference",
        bgColor: "rgb(40, 40, 40)" // Slightly lighter dark background
    }
]
const MotionLink = motion(Link)
export default function HeroSection() {

    return(
        <section className={`@container hero bg-[url(/images/jascent-leung--uF6u5Cmnsw-unsplash.jpg)] bg-no-repeat bg-cover bg-center h-dvh`}>
                <Wrapper className={`flex flex-col h-[100%] justify-end `}>
                    <div className={`flex flex-col capitalize text-white @md:py-10 py-5 @md:w-2xl`}>
                        <span>sale of the season</span>
                    <h1 className={`font-family-apercu-pro`}>
                        up to 40% off
                    </h1>
                        <section className={`flex gap-4 items-center @md:w-md `}>
                            {
                                genderSelect.map(gender=>(
                                    <MotionLink
                                        href={gender.path}
                                        key={gender.id}
                                        initial={{ backgroundColor: "transparent" }}
                                        whileHover={{
                                            backgroundColor: gender.bgColor,
                                            scale: 1.02,
                                            transition: { duration: 0.2, ease: "easeIn", },
                                        }}
                                        className="px-6 py-3 rounded-lg"
                                    >
                                        {gender.name}
                                    </MotionLink>
                                ))
                            }
                        </section>
                    </div>
                </Wrapper>
        </section>
    )
}