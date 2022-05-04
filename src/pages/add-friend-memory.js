import React, { useState, useEffect } from 'react';


import {StateMachineProvider} from "little-state-machine";

import Layout from "../components/Layout"
import AddFriendMemory from "../components/AddFriendMemory"
import Seo from "../components/seo"


const PreviewMemoryPage = () => {

    useEffect(() => {



    }, []);

    return (
        <>

            <StateMachineProvider>
                <Layout>
                    <Seo title="Friend Add Memory" image="https://afsp-loving-memories.netlify.app/svg/afsp-memories-social.jpg"/>
                    <AddFriendMemory/>
                </Layout>
            </StateMachineProvider>

        </>
    )
}

export default PreviewMemoryPage