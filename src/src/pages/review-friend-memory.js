import React, { useState, useEffect } from 'react';


import {StateMachineProvider} from "little-state-machine";

import Layout from "../components/Layout"
import ReviewFriendMemory from "../components/AddMemory/ReviewFriendMemory"
import Seo from "../components/seo"


const PreviewMemoryPage = () => {

    useEffect(() => {



    }, []);

    return (
        <>

            <StateMachineProvider>
                <Layout>
                    <Seo title="Review Friend Memory" image="https://afsp-loving-memories.netlify.app/svg/afsp-memories-social.jpg"/>
                    <ReviewFriendMemory/>
                </Layout>
            </StateMachineProvider>

        </>
    )
}

export default PreviewMemoryPage