import React, { useState, useEffect } from 'react';


import {StateMachineProvider} from "little-state-machine";

import Layout from "../components/Layout"
import SubmitFriendMemory from "../components/FriendSubmitted"
import Seo from "../components/seo"


const PreviewMemoryPage = () => {

    useEffect(() => {



    }, []);

    return (
        <>

            <StateMachineProvider>
                <Layout>
                    <Seo title="Friend Memory Submitted" image="https://afsp-loving-memories.netlify.app/svg/afsp-memories-social.jpg"/>
                    <SubmitFriendMemory/>
                </Layout>
            </StateMachineProvider>

        </>
    )
}

export default PreviewMemoryPage